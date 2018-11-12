"use strict";
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const { findUnfinishedUserById } = require("../users/models");
const db = require("../db");
const config = require("../config");
const router = express.Router();

const createAuthToken = function(user) {
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.email,
    expiresIn: config.JWT_EXPIRY,
    algorithm: "HS256"
  });
};

const localAuth = passport.authenticate("local", { session: false });
router.use(bodyParser.json());

// The user provides a email and password to login
router.post("/login", localAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

const jwtAuth = passport.authenticate("jwt", { session: false });

// The user exchanges a valid JWT for a new one with a later expiration
router.post("/refresh", jwtAuth, (req, res) => {
  db.query(findUnfinishedUserById(req.user.user_id))
    .then(dbres => {
      const authToken = createAuthToken(dbres.rows[0]);
      res.json({ authToken });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json("Something went wrong on the server");
    });
});

module.exports = { router, createAuthToken };
