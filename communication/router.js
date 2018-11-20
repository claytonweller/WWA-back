"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");

const { jwtStrategy } = require("../auth");
const { SENDGRID_KEY } = require("../config");
const db = require("../db");
const { findUserById } = require("../users/models");

const jwtAuth = passport.authenticate("jwt", { session: false });

const router = express.Router();
const jsonParser = bodyParser.json();
passport.use(jwtStrategy);
router.use(jsonParser);
sgMail.setApiKey(SENDGRID_KEY);

// This uses the basic sendgrid API
// This makes it so that we never give out someone's email
// without their permission.

router.post("/", jwtAuth, (req, res) => {
  let msg = {
    from: req.user.email,
    subject: req.body.subject,
    text: `${
      req.body.contact
    }. --- This Message was sent through Work With Artists (WWA). 
    If you would like to stop receiving emails from WWA users, simply visit www.workwithartists.com and remove your disciplines.
    Everyone deserves respect. If you have received an email that has made you uncomfortable or insulting please forward the message to me (Clayton Weller) at clayton.weller@gmail .com. I will personally take action to make WWA a place where we can all connect safely.`,
    html: `<h1>Work With Artists</h1>
      <p>${req.body.contact}</p>
      <div>
      <div>---</div>
      <div>This Message was sent through Work With Artists (WWA).</div>
      <div>If you would like to stop receiving emails from WWA users, simply visit <a href="http://www.workwithartists.com">www.workwithartists.com</a> and remove your disciplines.</div>
      ----
      <div>Everyone deserves respect. If you have received an email that has made you uncomfortable please forward the message to me, (Clayton Weller) at clayton.weller@gmail.com . I will personally take action to make WWA a place where we can all connect safely.</div>`
  };

  db.query(findUserById(req.body.artistId))
    .then(dbres => {
      msg.to = dbres.rows[0].email;
    })
    .then(() => {
      return sgMail.send(msg);
    })
    .then(_res => res.status(201).json({ message: "Sent" }))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Something went wrong on the server" });
    });
});

module.exports = { router };
