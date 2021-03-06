"use strict";
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const passport = require("passport");

const { users: usersRouter } = require("./users");
const { images: imagesRouter } = require("./users");
const { router: authRouter, localStrategy, jwtStrategy } = require("./auth");
const { router: disciplinesRouter } = require("./disciplines");
const { router: userDisciplinesRouter } = require("./user_disciplines");
const { router: commRouter } = require("./communication");

const { PORT } = require("./config");

const app = express();

// Logging
app.use(morgan("common"));

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use("/api/users/", usersRouter);
app.use("/api/images/", imagesRouter);
app.use("/api/auth/", authRouter);
app.use("/api/disciplines/", disciplinesRouter);
app.use("/api/user_disciplines/", userDisciplinesRouter);
app.use("/api/communication/", commRouter);

app.use("*", (req, res) => {
  return res.status(404).json({ message: "Not Found" });
});

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer(port = PORT) {
  return new Promise((resolve, reject) => {
    server = app
      .listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on("error", err => {
        reject(err);
      });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log("Closing server");
    server.close(err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
