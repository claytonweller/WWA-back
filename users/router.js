"use strict";
const express = require("express");
const bodyParser = require("body-parser");

const {
  findUserById,
  findUsersByDiscipline,
  findUserByEmail
} = require("./models");
const db = require("../db");

const router = express.Router();
const jsonParser = bodyParser.json();

router.get("/", jsonParser, (req, res, next) => {
  db.query(findUsersByDiscipline(req.query.type))
    .then(disciplines => res.json(disciplines.rows))
    .catch(err => console.log(err));
  // TODO
  // POSSIBLE Pageing (Maybe not in MVP)
});

router.get("/:id", jsonParser, (req, res) => {
  db.query(findUserById(req.params.id))
    .then(dbres => res.json(dbres.rows))
    .catch(err => console.log(err));
});

router.put("/:id", jsonParser, (req, res) => {
  const updatedableFields = [
    "first_name",
    "last_name",
    "desired_projects",
    "bio",
    "dob",
    "city",
    "state",
    "equipment",
    "password",
    "email"
  ];

  const createSetStatement = field => {
    return `${field} = '${req.body[field]}' `;
  };

  const filteredFields = Object.keys(req.body).filter(field =>
    updatedableFields.includes(field)
  );

  const allSetStatments = filteredFields.map(field => {
    return createSetStatement(field);
  });

  if (!allSetStatments[0]) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "No appropriate Fields",
      location: "Request body"
    });
  }

  // No white space allowed in primary key fields
  const explicityTrimmedFields = ["email", "password"];
  const nonTrimmedField = explicityTrimmedFields.find(field => {
    if (req.body[field]) {
      return req.body[field].trim() !== req.body[field];
    }
  });

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Cannot start or end with whitespace",
      location: nonTrimmedField
    });
  }

  // Make sure that fields aren't too big or small
  const sizedFields = {
    first_name: {
      min: 1,
      max: 20
    },
    last_name: {
      min: 1,
      max: 20
    },
    desired_projects: {
      max: 150
    },
    password: {
      min: 8,
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(field => {
    if (req.body[field] || req.body[field] === "") {
      return (
        "min" in sizedFields[field] &&
        req.body[field].trim().length < sizedFields[field].min
      );
    }
  });

  const tooLargeField = Object.keys(sizedFields).find(field => {
    if (req.body[field]) {
      return (
        "max" in sizedFields[field] &&
        req.body[field].trim().length > sizedFields[field].max
      );
    }
  });

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

  // This query first checks to make sure any email update is unique
  // then it updates the appropriate columns
  // then it returns the new user object.

  db.query(findUserById(req.params.id))
    .then(dbres => {
      if (filteredFields.includes("email")) {
        return db.query(findUserByEmail(req.body.email));
      }
      return dbres;
    })
    .then(dbres => {
      if (!dbres.rows[0]) {
        return;
      }
      if (req.params.id != dbres.rows[0].user_id) {
        return Promise.reject({
          code: 422,
          reason: "ValidationError",
          message: "email already taken",
          location: "email"
        });
      }
      return;
    })
    .then(() => {
      return db.query(
        `
          UPDATE users
          SET ${allSetStatments}
          WHERE user_id = '${req.params.id}'
        `
      );
    })
    .then(() => {
      return db.query(findUserById(req.params.id));
    })
    .then(user => {
      res.json(user.rows[0]);
    })
    .catch(err => {
      console.log(err);
      if (err.reason === "ValidationError") {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: "Internal server error" });
    });
});

// Post to register a new user
// This only happens after the first step.
// Needs a flag for the steps completed.
router.post("/", jsonParser, (req, res) => {
  const requiredFields = ["email", "password", "last_name", "first_name"];
  const missingField = requiredFields.find(field => !(field in req.body));
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Missing field",
      location: missingField
    });
  }

  const stringFields = ["email", "password", "first_name", "last_name"];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== "string"
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Incorrect field type: expected string",
      location: nonStringField
    });
  }

  const explicityTrimmedFields = ["email", "password"];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Cannot start or end with whitespace",
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    first_name: {
      min: 1,
      max: 20
    },
    last_name: {
      min: 1,
      max: 20
    },
    password: {
      min: 8,
      max: 72
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

  let {
    email,
    password,
    first_name,
    last_name,
    dob = 1538349369782,
    city = "",
    state = "",
    date_joined = Date.now()
  } = req.body;
  console.log(date_joined);
  firstName = firstName.trim();
  lastName = lastName.trim();

  return res.json("made it!");
  // return User.find({ username })
  //   .count()
  //   .then(count => {
  //     if (count > 0) {
  //       // There is an existing user with the same username
  //       return Promise.reject({
  //         code: 422,
  //         reason: "ValidationError",
  //         message: "Username already taken",
  //         location: "username"
  //       });
  //     }
  //     // If there is no existing user, hash the password
  //     return User.hashPassword(password);
  //   })
  //   .then(hash => {
  //     return User.create({
  //       username,
  //       password: hash,
  //       firstName,
  //       lastName
  //     });
  //   })
  //   .then(user => {
  //     return res.status(201).json(user.serialize());
  //   })
  //   .catch(err => {
  //     // Forward validation errors on to the client, otherwise give a 500
  //     // error because something unexpected has happened
  //     if (err.reason === "ValidationError") {
  //       return res.status(err.code).json(err);
  //     }
  //     res.status(500).json({ code: 500, message: "Internal server error" });
  //   });
});

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
// router.get("/", (req, res) => {
//   return User.find()
//     .then(users => res.json(users.map(user => user.serialize())))
//     .catch(err => res.status(500).json({ message: "Internal server error" }));
// });

module.exports = { router };
