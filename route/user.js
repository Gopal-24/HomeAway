const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js")

router.get("/signup", userController.renderSignUpForm);

router.post(
  "/signup",
  wrapAsync(userController.userSignUp)
);

router.get("/login", userController.renderLogInForm);

router.post("/login",saveRedirectUrl, userController.userLogIn);

router.get("/logout", userController.userLogOut);

module.exports = router;
