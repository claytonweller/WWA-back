"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const { findDisciplineTypes, createNewDisciplineType } = require("./models");
const { jwtStrategy } = require("../auth");
const db = require("../db");

const jwtAuth = passport.authenticate("jwt", { session: false });

const router = express.Router();
const jsonParser = bodyParser.json();
passport.use(jwtStrategy);
router.use(jsonParser);

// Reuturns ALL discipline types.
// Used in the drop down menus for searches and creation

router.get("/", (req, res) => {
  db.query(findDisciplineTypes())
    .then(dbres => res.json(dbres.rows))
    .catch(err => {
      console.log(err);
      res.status(500).json("Something went wrong on the server");
    });
});

// Creates a new discipline type,
// Used on the add user discipline form.
router.post("/", jwtAuth, (req, res) => {
  const requiredFields = ["new_type"];
  const missingField = requiredFields.find(field => !(field in req.body));
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Missing field",
      location: missingField
    });
  }

  db.query(findDisciplineTypes(req.body.new_type))
    .then(dbres => {
      if (dbres.rows[0]) {
        return Promise.reject({
          code: 422,
          reason: "ValidationError",
          message: "This is already a discipline"
        });
      }
      return db.query(createNewDisciplineType(req.body.new_type));
    })
    .then(() => db.query(findDisciplineTypes()))
    .then(dbres => res.status(201).json(dbres.rows))
    .catch(err => {
      console.log(err);
      if (err.reason === "ValidationError") {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: "Internal server error" });
    });
});

module.exports = { router };
