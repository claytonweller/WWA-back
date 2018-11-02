"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const { SENDGRID_KEY } = require("../config");
const sgMail = require("@sendgrid/mail");

console.log(SENDGRID_KEY);

const { jwtStrategy } = require("../auth");

const jwtAuth = passport.authenticate("jwt", { session: false });

const router = express.Router();
const jsonParser = bodyParser.json();
passport.use(jwtStrategy);
router.use(jsonParser);
sgMail.setApiKey(SENDGRID_KEY);

router.post("/", jwtAuth, (req, res) => {
  console.log(req.body);
  const msg = {
    to: req.body.toEmail,
    from: req.user.email,
    subject: req.body.subject,
    text: `${
      req.body.text
    }. --- This Message was sent through Work With Artists (WWA). If you would like to opt out of receiving emails from WWA please visit this link: LINK`,
    html: `<h1>Work With Artists</h1>
      <div>${req.body.text}</div> 
      <div> --- This Message was sent through Work With Artists (WWA). If you would like to opt out of receiving emails from WWA please visit this link: LINK</div>`
  };
  sgMail
    .send(msg)
    .then(_res => res.status(201).json(_res))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Something went wrong on the server" });
    });
});

module.exports = { router };
