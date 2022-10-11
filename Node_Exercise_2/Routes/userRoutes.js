const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../Controller/userController");
const jwt = require("jsonwebtoken");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/profile", userController.profile);

//Google
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

//Callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/api/auth/google/callback/success",
    failureRedirect: "/api/auth/google/callback/failure",
  })
);

// Success
router.get("/auth/google/callback/success", (req, res) => {
  if (!req.user) res.redirect("/api/auth/google/callback/failure");
  let googleToken = jwt.sign(req.session.passport.user, "mySecret");
  res.redirect(
    "http://127.0.0.1:5500/Node_Exercise_2/View/redirect.html?TOKEN=" +
      googleToken
  );
});

//failure
router.get("/api/auth/google/callback/failure", (req, res) => {
  res.send("Error");
});

//Github
router.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

//Callback
router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    successRedirect: "/api/auth/github/callback/success",
    failureRedirect: "/api/auth/github/callback/failure",
  })
);

//Success
router.get("/auth/github/callback/success", (req, res) => {
  console.log(req.session.passport.user, " github");
  if (!req.user) res.redirect("/api/auth/github/callback/failure");
  //session login
  const githubToken = jwt.sign(req.session.passport.user, "mySecret");
  res.redirect(
    "http://127.0.0.1:5500/Node_Exercise_2/View/redirect.html?TOKEN=" +
      githubToken
  );
});

//fail
router.get("/api/auth/github/callback/failure", (req, res) => {
  res.send("Error");
});

//Facebook
router.get("/auth/facebook", passport.authenticate("facebook"));

//Callback
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/api/auth/facebook/callback/success",
    failureRedirect: "/api/auth/facebook/callback/failure",
  })
);

//Success
router.get("/auth/facebook/callback/success", (req, res) => {
  if (!req.user) res.redirect("/api/auth/facebook/callback/failure");
  //session login
  const facebookToken = jwt.sign(req.session.passport.user, "mySecret");
  res.redirect(
    "http://127.0.0.1:5500/Node_Exercise_2/View/redirect.html?TOKEN=" +
      facebookToken
  );
});

//fail
router.get("/api/auth/facebook/callback/failure", (req, res) => {
  res.send("Error");
});

module.exports = router;
