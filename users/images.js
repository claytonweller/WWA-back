"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");
const formData = require("express-form-data");
const passport = require("passport");
const {
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} = require("../config");
const { findUserById } = require("./models");

const db = require("../db");
const { jwtStrategy } = require("../auth");

const jwtAuth = passport.authenticate("jwt", { session: false });
const router = express.Router();

passport.use(jwtStrategy);
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(formData.parse());

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

router.post("/", jwtAuth, (req, res) => {
  let userId = req.user.user_id;

  if (req.files.imageFile.size / 1024 / 1024 > 0.5) {
    res.status(413).json({ msg: "Image too large" });
  }
  cloudinary.uploader
    .upload(req.files.imageFile.path)
    .then(res => {
      return db.query(
        `
          UPDATE users
          SET img_url = '${res.url}'
          WHERE user_id = '${userId}'
        `
      );
    })
    .then(() => db.query(findUserById(userId)))
    .then(dbres => {
      return res.status(200).json({ img_url: dbres.rows[0].img_url });
    })
    .catch(err => console.log(err));
});

module.exports = { router };
