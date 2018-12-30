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
    .then(() => res.status(200))
    .catch(err => console.log(err));
});

module.exports = { router };
