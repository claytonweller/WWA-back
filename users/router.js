"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const {
  findUserById,
  findUnfinishedUserById,
  findUserByEmail,
  findUsersByDiscipline,
  findAllUsers,
  createUser,
  hashPassword,
  fixSingleQuotesForSQL
} = require("./models");
const db = require("../db");
const { jwtStrategy } = require("../auth");

const jwtAuth = passport.authenticate("jwt", { session: false });
const router = express.Router();
const jsonParser = bodyParser.json();
passport.use(jwtStrategy);
router.use(jsonParser);

// This function is used for DOB(date of birth) formatting/logic
const convertToTimeStamp = inputDate => {
  let fullDate = new Date(inputDate);
  return Date.parse(fullDate);
};

router.get("/", jwtAuth, (req, res, next) => {
  // If the searcher is looking for a specific type of artist
  // we get a dscipline type, and return all of those users.
  if (req.query.type) {
    return db
      .query(findUsersByDiscipline(req.query.type))
      .then(disciplines => res.json(disciplines.rows))
      .catch(err => {
        console.log(err);
        res.status(500).json("Something went wrong on the server");
      });
  }

  // Otherwise we return all the artists. Eventurally I'll have to limit
  // TODO: Limit responses
  // TODO: Sort by some attribute
  return db
    .query(findAllUsers())
    .then(dbres => {
      res.json(dbres.rows);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json("Something went wrong on the server");
    });
});

router.post("/test", (req, res) => {
  console.log(req.body);
  res.status(200).json(req.body);
});

// Find a specic user's info
router.get("/:id", jwtAuth, (req, res) => {
  if (req.user.user_id != req.params.id) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "User does not have access"
    });
  }

  return db
    .query(findUserById(req.params.id))
    .then(dbres => {
      if (!dbres.rows[0]) {
        return db.query(findUnfinishedUserById(req.params.id));
      }
      return dbres;
    })
    .then(dbres => res.json(dbres.rows))
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
router.post("/", (req, res) => {
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

  const stringFields = ["email", "password", "first_name", "last_name", "city"];
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
    dob = 0,
    city = "",
    state = "CO",
    date_joined = Date.now()
  } = req.body;

  first_name = fixSingleQuotesForSQL(first_name.trim());
  last_name = fixSingleQuotesForSQL(last_name.trim());
  city = fixSingleQuotesForSQL(city.trim());
  dob = convertToTimeStamp(dob);

  let userObject = {
    email,
    password,
    first_name,
    last_name,
    dob,
    city,
    state,
    date_joined
  };

  return hashPassword(password)
    .then(hash => {
      userObject.password = hash;
      return db.query(findUserByEmail(email));
    })
    .then(dbres => {
      if (dbres.rows[0]) {
        return Promise.reject({
          code: 422,
          reason: "ValidationError",
          message: "email already taken",
          location: "email"
        });
      }

      return db.query(createUser(userObject));
    })
    .then(() => {
      return db.query(findUserByEmail(email));
    })
    .then(dbres => {
      return res.status(201).json(dbres.rows);
    })
    .catch(err => {
      console.log(err);
      if (err.reason === "ValidationError") {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: "Internal server error" });
    });
});

// THis updates a user with new info. After the first modal screen this
// is the only thing that gets called when a user submits info.
// Unless it's about their specific disciplines (See user_disciplines)

router.put("/:id", jwtAuth, (req, res) => {
  if (req.user.user_id != req.params.id) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "User does not have access"
    });
  }

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
    "email",
    "img_url"
  ];

  // We have to be very careful with strings in SQL.
  // In models we have a function that fixes the information so
  // our calls aren't ruined by a single apostrophe
  const stringFields = [
    "first_name",
    "last_name",
    "desired_projects",
    "bio",
    "city",
    "equipment",
    "password"
  ];

  if (req.body.dob) {
    req.body.dob = convertToTimeStamp(req.body.dob);
  }

  const createSetStatement = field => {
    if (stringFields.includes(field)) {
      return `${field} = '${fixSingleQuotesForSQL(req.body[field])}' `;
    }
    return `${field} = '${req.body[field]}' `;
  };

  const filteredFields = Object.keys(req.body).filter(field =>
    updatedableFields.includes(field)
  );

  if (!filteredFields[0]) {
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
      max: 250
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
        ? `Min ${sizedFields[tooSmallField].min} characters long`
        : `Max ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  // This query first checks to make sure any email update is unique
  // then it updates the appropriate columns
  // then it returns the new user object.
  db.query(findUnfinishedUserById(req.params.id))
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
      if (req.body.password) {
        return hashPassword(req.body.password);
      }
      return;
    })
    .then(hash => {
      if (hash) {
        req.body.password = hash;
      }
      return filteredFields.map(field => {
        return createSetStatement(field);
      });
    })
    .then(sql => {
      return db.query(
        `
          UPDATE users
          SET ${sql}
          WHERE user_id = '${req.params.id}'
        `
      );
    })
    .then(() => {
      return db.query(findUserById(req.params.id));
    })
    .then(dbres => {
      // Occasionally a user will not have any discplines which will break the
      // typical SQL request
      if (!dbres.rows[0]) {
        return db.query(findUnfinishedUserById(req.params.id));
      }
      return dbres;
    })
    .then(user => {
      res.status(201).json(user.rows[0]);
    })
    .catch(err => {
      console.log(err);
      if (err.reason === "ValidationError") {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: "Internal server error" });
    });
});

module.exports = { router };
