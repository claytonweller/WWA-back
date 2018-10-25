"use strict";
const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { findUserForAuth, validatePassword } = require("../users/models");
const { JWT_SECRET } = require("../config");
const db = require("../db");

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password"
  },
  (email, password, callback) => {
    let user;
    db.query(findUserForAuth(email))
      .then(dbres => {
        user = dbres.rows[0];
        if (!user) {
          return Promise.reject({
            reason: "LoginError",
            message: "Incorrect email or password"
          });
        }
        return validatePassword(password, user.password);
      })
      .then(isValid => {
        if (!isValid) {
          return Promise.reject({
            reason: "LoginError",
            message: "Incorrect email or password"
          });
        }
        return callback(null, user);
      })
      .catch(err => {
        if (err.reason === "LoginError") {
          return callback(null, false, err);
        }
        return callback(err, false);
      });
  }
);

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
    algorithms: ["HS256"]
  },
  (payload, done) => {
    done(null, payload.user);
  }
);

module.exports = { localStrategy, jwtStrategy };
