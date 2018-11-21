"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");
const { deleteUser } = require("../users/models");
const { deleteDiscplineType } = require("../disciplines/models");
const db = require("../db");
const { createAuthToken } = require("../auth/router");

const expect = chai.expect;
chai.use(chaiHttp);

describe("/api/disciplines/", function() {
  const email = "exampleUser@123.com";
  const password = "examplePass";
  const first_name = "Example";
  const last_name = "User";

  let user1 = {
    email,
    password,
    first_name,
    last_name,
    city: "Denver"
  };

  let authToken;

  before(function() {
    return runServer()
      .then(() => {
        return chai
          .request(app)
          .post("/api/users")
          .send(user1);
      })
      .then(res => {
        let resUser = res.body[0];
        user1.user_id = resUser.user_id;
        authToken = createAuthToken(user1);
      });
  });

  after(function() {
    return db
      .query(deleteUser(user1.user_id))
      .then(() => closeServer())
      .then(() => console.log("END TYPES"));
  });

  beforeEach(function() {});

  afterEach(function() {});

  ///POST DISCIPLINE TYPE
  describe("POST DISCIPLINE TYPE", function() {
    it("should require a JWT", function() {
      return chai
        .request(app)
        .post(`/api/disciplines/`)
        .set("Authorization", "")
        .send({ new_type: "NEWTYPE" })
        .then(() => expect.fail(null, null, "Request should not succeed"))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(401);
        });
    });

    it("should create a new discipline type", function() {
      return chai
        .request(app)
        .post(`/api/disciplines/`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ new_type: "NEWTYPE" })
        .then(res => {
          let wanted = res.body.find(obj => obj.type === "NEWTYPE");
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("array");
          expect(wanted).to.exist;
          expect(wanted).to.include.keys("type_id", "type");
        });
    });
  });

  // GET ALL DISCPLINE TYPES
  describe("GET ALL DISCIPLINE TYPES", function() {
    it("should return  a new discipline type", function() {
      return chai
        .request(app)
        .get(`/api/disciplines/`)
        .then(res => {
          let wanted = res.body.find(obj => obj.type === "NEWTYPE");
          expect(res.body).to.be.an("array");
          expect(wanted).to.exist;
          expect(wanted).to.include.keys("type_id", "type");
          db.query(deleteDiscplineType(wanted.type_id));
        });
    });
  });
});
