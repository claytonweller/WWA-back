"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");

const { app, runServer, closeServer } = require("../server");
const { JWT_SECRET } = require("../config");
const { deleteUser } = require("../users/models");
const db = require("../db");

const expect = chai.expect;
chai.use(chaiHttp);

describe("Auth endpoints", function() {
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
      });
  });

  after(function() {
    return db
      .query(deleteUser(user1.user_id))
      .then(() => closeServer())
      .then(() => console.log("END AUTH"));
  });

  beforeEach(function() {});

  afterEach(function() {});

  describe("/api/auth/login", function() {
    it("Should reject requests with no credentials", function() {
      return chai
        .request(app)
        .post("/api/auth/login")
        .then(() => expect.fail(null, null, "Request should not succeed"))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(400);
        });
    });

    it("Should return a valid auth token", function() {
      return chai
        .request(app)
        .post("/api/auth/login")
        .send({ email, password })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          const token = res.body.authToken;
          expect(token).to.be.a("string");
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ["HS256"]
          });
          const resUser = payload.user;
          expect(resUser).to.include.keys(
            "user_id",
            "bio",
            "city",
            "date_joined",
            "desired_projects",
            "dob",
            "email",
            "equipment",
            "first_name",
            "last_name",
            "img_url",
            "state"
          );
          expect(resUser).to.be.an("object");
          expect(resUser.first_name).to.equal(user1.first_name);
          expect(resUser.last_name).to.equal(user1.last_name);
          expect(resUser.email).to.equal(user1.email);
        });
    });
  });

  describe("/api/auth/refresh", function() {
    it("Should reject requests with no credentials", function() {
      return chai
        .request(app)
        .post("/api/auth/refresh")
        .then(() => expect.fail(null, null, "Request should not succeed"))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it("Should reject requests with an invalid token", function() {
      const token = jwt.sign(
        {
          email,
          first_name,
          last_name,
          user_id: user1.user_id
        },
        "wrongSecret",
        {
          algorithm: "HS256",
          expiresIn: "7d"
        }
      );

      return chai
        .request(app)
        .post("/api/auth/refresh")
        .set("Authorization", `Bearer ${token}`)
        .then(() => expect.fail(null, null, "Request should not succeed"))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });

    it("Should return a valid auth token with a newer expiry date", function() {
      const token = jwt.sign(
        {
          user: {
            email,
            first_name,
            last_name,
            user_id: user1.user_id
          }
        },
        JWT_SECRET,
        {
          algorithm: "HS256",
          subject: email,
          expiresIn: "7d"
        }
      );
      const decoded = jwt.decode(token);

      return chai
        .request(app)
        .post("/api/auth/refresh")
        .set("authorization", `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          const token = res.body.authToken;
          expect(token).to.be.a("string");
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ["HS256"]
          });
          const resUser = payload.user;
          expect(resUser).to.include.keys(
            "user_id",
            "bio",
            "city",
            "date_joined",
            "desired_projects",
            "dob",
            "email",
            "equipment",
            "first_name",
            "last_name",
            "img_url",
            "state"
          );
          expect(resUser).to.be.an("object");
          expect(resUser.first_name).to.equal(user1.first_name);
          expect(resUser.last_name).to.equal(user1.last_name);
          expect(resUser.email).to.equal(user1.email);
          expect(payload.exp).to.be.at.least(decoded.exp);
        });
    });
  });
});
