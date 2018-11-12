// "use strict";

// const chai = require("chai");
// const chaiHttp = require("chai-http");

// const { app, runServer, closeServer } = require("../server");
// const { deleteUser } = require("../users/models");
// const db = require("../db");
// const { createAuthToken } = require("../auth/router");

// const expect = chai.expect;
// chai.use(chaiHttp);

// describe("/api/user", function() {
//   const email = "exampleUser@123.com";
//   const password = "examplePass";
//   const first_name = "Example";
//   const last_name = "User";

//   let user1 = {
//     email,
//     password,
//     first_name,
//     last_name,
//     city: "Denver"
//   };

//   before(function() {
//     return runServer();
//   });

//   after(function() {
//     return db.query(deleteUser(user1.user_id)).then(() => closeServer());
//   });

//   beforeEach(function() {});

//   afterEach(function() {});

//   describe("/api/users", function() {
//     //////POST USER
//     // This one must happen before any test that requires an AuthToken.
//     let authToken;
//     describe("POST USER", function() {
//       it("should reject a new user with no fields", function() {
//         return chai
//           .request(app)
//           .post("/api/users")
//           .then(() => expect.fail(null, null, "Request should not succeed"))
//           .catch(err => {
//             if (err instanceof chai.AssertionError) {
//               throw err;
//             }

//             const res = err.response;
//             expect(res).to.have.status(422);
//           });
//       });

//       it("should reject a new user with missing fields", function() {
//         return chai
//           .request(app)
//           .post("/api/users")
//           .send({ password })
//           .then(() => expect.fail(null, null, "Request should not succeed"))
//           .catch(err => {
//             if (err instanceof chai.AssertionError) {
//               throw err;
//             }

//             const res = err.response;
//             expect(res).to.have.status(422);
//           });
//       });

//       it("should create and return a user with the correct fields", function() {
//         return chai
//           .request(app)
//           .post("/api/users")
//           .send(user1)
//           .then(res => {
//             let resUser = res.body[0];
//             expect(resUser).to.include.keys(
//               "user_id",
//               "bio",
//               "city",
//               "date_joined",
//               "desired_projects",
//               "dob",
//               "email",
//               "equipment",
//               "first_name",
//               "last_name",
//               "img_url",
//               "state"
//             );
//             expect(resUser).to.be.an("object");
//             expect(resUser.first_name).to.equal(user1.first_name);
//             expect(resUser.last_name).to.equal(user1.last_name);
//             expect(resUser);
//             expect(res).to.have.status(201);

//             // This makes the user accessible by other calls
//             user1.user_id = resUser.user_id;
//             authToken = createAuthToken(user1);
//           });
//       });
//     });

//     ///////PUT USER

//     describe("PUT USER", function() {
//       it("should require a JWT", function() {
//         return chai
//           .request(app)
//           .put("/api/users/")
//           .set("Authorizati0n", "")
//           .then(() => expect.fail(null, null, "Request should not succeed"))
//           .catch(err => {
//             if (err instanceof chai.AssertionError) {
//               throw err;
//             }
//             const res = err.response;
//             expect(res).to.have.status(404);
//           });
//       });

//       it("should return an existing user with the appropriate values", function() {
//         return chai
//           .request(app)
//           .put(`/api/users/${user1.user_id}`)
//           .set("Authorization", `Bearer ${authToken}`)
//           .send({ last_name: "NEWLASTNAME", user_id: user1.user_id })
//           .then(res => {
//             expect(res).to.have.status(201);
//             expect(res.body).to.be.an("object");
//             expect(res.body.last_name).to.equal("NEWLASTNAME");
//           });
//       });
//     });

//     ////// GET ALL USERS

//     describe("GET ALL USERS", function() {
//       it("Should return an array with user objects", function() {
//         return chai
//           .request(app)
//           .get("/api/users")
//           .set("Authorization", `Bearer ${authToken}`)
//           .then(res => {
//             expect(res).to.have.status(200);
//             expect(res.body).to.be.an("array");
//             expect(res.body[0]).to.include.keys(
//               "user_id",
//               "bio",
//               "city",
//               "date_joined",
//               "desired_projects",
//               "disciplines",
//               "dob",
//               "equipment",
//               "first_name",
//               "last_name",
//               "img_url",
//               "state"
//             );
//             expect(res.body[0]).to.not.include.keys("password", "email");
//           });
//       });
//       it("should require a JWT", function() {
//         return chai
//           .request(app)
//           .get("/api/users")
//           .set("Authorization", "")
//           .then(() => expect.fail(null, null, "Request should not succeed"))
//           .catch(err => {
//             if (err instanceof chai.AssertionError) {
//               throw err;
//             }

//             const res = err.response;
//             expect(res).to.have.status(401);
//           });
//       });
//     });

//     ////// GET SPECIFIC USER

//     describe("GET SPECIFIC USER", function() {
//       it("should require a JWT", function() {
//         return chai
//           .request(app)
//           .get(`/api/users/${user1.user_id}`)
//           .set("Authorization", "")
//           .then(() => expect.fail(null, null, "Request should not succeed"))
//           .catch(err => {
//             if (err instanceof chai.AssertionError) {
//               throw err;
//             }
//             const res = err.response;
//             expect(res).to.have.status(401);
//           });
//       });

//       it("should return a specific user with their info", function() {
//         return chai
//           .request(app)
//           .get(`/api/users/${user1.user_id}`)
//           .set("Authorization", `Bearer ${authToken}`)
//           .then(res => {
//             expect(res).to.have.status(200);
//             expect(res.body[0]).to.be.an("object");
//             expect(res.body[0]).to.include.keys(
//               "user_id",
//               "bio",
//               "city",
//               "date_joined",
//               "desired_projects",
//               "email",
//               "dob",
//               "equipment",
//               "first_name",
//               "last_name",
//               "img_url",
//               "state"
//             );
//             expect(res.body[0]).to.not.include.keys("password");
//           });
//       });
//     });

//     //
//   });
// });
