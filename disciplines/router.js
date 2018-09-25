"use strict";
const express = require("express");
const bodyParser = require("body-parser");

// const { Discipline } = require("./models");

const router = express.Router();

const jsonParser = bodyParser.json();

router.get("/", jsonParser, (req, res) => {
  //TODO get the complete list of disciplines
});

router.post("/", jsonParser, (req, res) => {
  // TODO post a new discipline for everyone to use
});

module.exports = { router };
