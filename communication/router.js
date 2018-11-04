"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");

const { jwtStrategy } = require("../auth");
const { SENDGRID_KEY } = require("../config");
const db = require("../db");
const { findUserById } = require("../users/models");

console.log(SENDGRID_KEY);

const jwtAuth = passport.authenticate("jwt", { session: false });

const router = express.Router();
const jsonParser = bodyParser.json();
passport.use(jwtStrategy);
router.use(jsonParser);
sgMail.setApiKey(SENDGRID_KEY);

router.post("/", jwtAuth, (req, res) => {
  let msg = {
    from: req.user.email,
    subject: req.body.subject,
    text: `${
      req.body.contact
    }. --- This Message was sent through Work With Artists (WWA). If you would like to opt out of receiving emails from WWA please visit this link: LINK`,
    html: `<h1>Work With Artists</h1>
      <div>${req.body.contact}</div>
      <div> --- This Message was sent through Work With Artists (WWA). If you would like to opt out of receiving emails from WWA please visit this link: LINK</div>`
  };

  db.query(findUserById(req.body.artistId))
    .then(dbres => (msg.to = dbres.rows[0].email))
    .then(() => {
      console.log(msg);
      return sgMail.send(msg);
    })
    .then(_res => res.status(201).json({ message: "Sent" }))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Something went wrong on the server" });
    });
});

module.exports = { router };
