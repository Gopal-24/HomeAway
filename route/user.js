const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registerdUser = await User.register(newUser, password);
      console.log(registerdUser);
      req.flash("success", "Welcom to HomeAway");
      res.redirect("/listings");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        // 1. Check for System Errors (like DB connection)
        if (err) {
            console.log("Error inside passport.authenticate:", err);
            return next(err);
        }

        // 2. Check if User/Password was wrong
        if (!user) {
            console.log("Authentication failed. Reason:", info.message);
            req.flash("error", info.message);
            return res.redirect("/login");
        }

        // 3. Manually Log In the User (This is where the hang usually happens)
        req.login(user, (err) => {
            if (err) {
                console.log("Error inside req.login (Session Save Failed):", err);
                return next(err);
            }

            // 4. Success!
            console.log("Login Successful! Redirecting...");
            req.flash("success", "Welcome back to HomeAway!");
            res.redirect("/listings");
        });
    })(req, res, next);
});

module.exports = router;
