"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");
const { deleteUser } = require("../users/models");
const db = require("../db");
const { createAuthToken } = require("../auth/router");

const expect = chai.expect;
chai.use(chaiHttp);

describe("/api/user_disciplines/", function() {
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

  let uDisc = {
    experience: 2012,
    type_id: 2,
    reward: "For Fun",
    active: "Yes"
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
        user1.user_id = uDisc.user_id = resUser.user_id;
        authToken = createAuthToken(user1);
      })
      .catch(err => console.log(err));
  });

  after(function() {
    return db
      .query(deleteUser(user1.user_id))
      .then(() => closeServer())
      .then(() => console.log("END UDISC"));
  });

  beforeEach(function() {});

  afterEach(function() {});

  ///POST USER DISICIPLINE
  describe("POST USER DISICIPLINE", function() {
    it("should require a JWT", function() {
      return chai
        .request(app)
        .post(`/api/user_disciplines/${user1.user_id}`)
        .set("Authorization", "")
        .send(uDisc)
        .then(() => expect.fail(null, null, "Request should not succeed"))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(401);
        });
    });

    it("should create a user discipline with the correct data", function() {
      // If we updated the database we may need to change the type_id
      return chai
        .request(app)
        .post(`/api/user_disciplines/${user1.user_id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(uDisc)
        .then(res => {
          let resDisc = res.body[0];
          expect(res).to.have.status(201);
          expect(res.body).to.have.length(1);
          expect(resDisc).to.be.an("object");
          expect(resDisc).to.include.keys(
            "u_discipline_id",
            "experience",
            "active",
            "reward",
            "user_id",
            "type_id",
            "type"
          );
          expect(resDisc.experience).to.equal(uDisc.experience);
          expect(resDisc.active).to.equal(uDisc.active);
          expect(resDisc.reward).to.equal(uDisc.reward);
          expect(resDisc.user_id).to.equal(uDisc.user_id);
          expect(resDisc.type_id).to.equal(uDisc.type_id);

          uDisc.u_discipline_id = resDisc.u_discipline_id;
        });
    });
    //
  });

  /// GET USER DISCIPLINE
  describe("GET ONE USER'S DISCIPLINES", function() {
    it("should require a JWT", function() {
      return chai
        .request(app)
        .get(`/api/user_disciplines/${user1.user_id}`)
        .set("Authorization", "")
        .then(() => expect.fail(null, null, "Request should not succeed"))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(401);
        });
    });

    it("should return a specific user's disciplines", function() {
      return chai
        .request(app)
        .get(`/api/user_disciplines/${user1.user_id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .then(res => {
          let resDisc = res.body[0];
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(resDisc).to.be.an("object");
          expect(resDisc).to.include.keys(
            "u_discipline_id",
            "experience",
            "active",
            "reward",
            "user_id",
            "type_id",
            "type"
          );
          expect(resDisc.experience).to.equal(uDisc.experience);
          expect(resDisc.active).to.equal(uDisc.active);
          expect(resDisc.reward).to.equal(uDisc.reward);
          expect(resDisc.user_id).to.equal(uDisc.user_id);
          expect(resDisc.type_id).to.equal(uDisc.type_id);
        });
    });
  });

  /////USER DISCIPLINE DELETE
  describe("DELETE A USER DISCIPLINE", function() {
    it("should require a JWT", function() {
      return chai
        .request(app)
        .delete(
          `/api/user_disciplines/${user1.user_id}/${uDisc.u_discipline_id}`
        )
        .set("Authorization", "")
        .then(() => expect.fail(null, null, "Request should not succeed"))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(401);
        });
    });

    it("delete a specific discpiline", function() {
      return chai
        .request(app)
        .delete(
          `/api/user_disciplines/${user1.user_id}/${uDisc.u_discipline_id}`
        )
        .set("Authorization", `Bearer ${authToken}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.have.length(0);

          return chai
            .request(app)
            .get(`/api/user_disciplines/${user1.user_id}`)
            .set("Authorization", `Bearer ${authToken}`);
        })
        .then(res => {
          let check = res.body.find(
            obj => obj.u_discipline_id === uDisc.u_discipline_id
          );
          expect(res.body).to.have.length(0);
          expect(check).to.not.exist;
        });
    });
  });
});
