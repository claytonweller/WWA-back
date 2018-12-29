"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");
// const passport = require("passport");
const {
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} = require("../config");

// const {
//   findUserById,
//   findUnfinishedUserById,
//   findUserByEmail,
//   findUsersByDiscipline,
//   findAllUsers,
//   createUser,
//   hashPassword,
//   fixSingleQuotesForSQL
// } = require("./models");
// const db = require("../db");
// const { jwtStrategy } = require("../auth");

// const jwtAuth = passport.authenticate("jwt", { session: false });
const router = express.Router();

// passport.use(jwtStrategy);
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

router.post("/", (req, res) => {
  let imageFile = req.body;
  console.log(imageFile);
  res.status(200).json(imageFile);
  // cloudinary.uploader.upload()
});

module.exports = { router };
