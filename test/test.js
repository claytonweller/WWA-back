"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");
const { deleteUser } = require("../users/models");
const db = require("../db");
const { createAuthToken } = require("../auth/router");

const expect = chai.expect;
chai.use(chaiHttp);

describe("/api/user", function() {
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
        console.log(user1);
      });
  });

  after(function() {
    return db.query(deleteUser(user1.user_id)).then(() => closeServer());
  });

  beforeEach(function() {});

  afterEach(function() {});

  describe("TEST", function() {
    expect(4).to.equal(4);
  });
});
