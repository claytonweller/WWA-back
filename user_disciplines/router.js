"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const {
  findUserDisciplines,
  createUserDiscipline,
  deleteUserDiscipline
} = require("./models");
const db = require("../db");
const { jwtStrategy } = require("../auth");
const jwtAuth = passport.authenticate("jwt", { session: false });

const router = express.Router();
const jsonParser = bodyParser.json();
router.use(jsonParser);

passport.use(jwtStrategy);

// return the disciplines of a specific user
router.get("/:id", jwtAuth, (req, res) => {
  if (req.user.user_id != req.params.id) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "User does not have access"
    });
  }

  return db
    .query(findUserDisciplines(req.params.id))
    .then(dbres => {
      res.json(dbres.rows);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json("Something went wrong on the server");
    });
});

// This creates a new discipline for a specific user
router.post("/:id", jwtAuth, (req, res) => {
  if (req.user.user_id != req.params.id) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "User does not have access"
    });
  }

  const requiredFields = [
    "user_id",
    "experience",
    "type_id",
    "reward",
    "active"
  ];
  const missingField = requiredFields.find(field => !(field in req.body));
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Missing field",
      location: missingField
    });
  }

  const sizedFields = {
    type: {
      min: 4,
      max: 25
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      "min" in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      "max" in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  // TODO figure out why the heck this isn't working

  // console.log(req.params.id, req.body.user_id);
  // if (req.params.id !== req.body.user_id) {
  //   return res.status(422).json({
  //     code: 422,
  //     reason: "ValidationError",
  //     message: "Body ID and Params ID do not match",
  //     location: "Body and/or Params"
  //   });
  // }

  let user_id = req.params.id;
  let { type_id, active, experience, reward } = req.body;

  let uDisc = {
    type_id,
    active,
    experience,
    reward,
    user_id
  };

  db.query(createUserDiscipline(uDisc))
    .then(() => {
      console.log("discipline created");
      return db.query(findUserDisciplines(req.params.id));
    })
    .then(dbres => res.status(201).json(dbres.rows))
    .catch(err => {
      console.log(err);
      res.status(500).json("Something went wrong on the server");
    });
});

router.delete("/:userId/:disciplineId", jwtAuth, (req, res) => {
  if (req.user.user_id != req.params.userId) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "User does not have access"
    });
  }

  db.query(deleteUserDiscipline(req.params.disciplineId))
    .then(() => {
      console.log(req.params.userId);
      return db.query(findUserDisciplines(req.params.userId));
    })
    .then(dbres => res.json(dbres.rows))
    .catch(err => {
      console.log(err);
      res.status(500).json("Something went wrong on the server");
    });
});

module.exports = { router };
