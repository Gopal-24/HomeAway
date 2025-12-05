const passport = require("passport");
const User = require("../models/user");

module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.userSignUp = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcom to HomeAway");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLogInForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.userLogIn = (req, res, next) => {
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
      req.flash("success", "Welcome back to HomeAway!");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
    });
  })(req, res, next);
};

module.exports.userLogOut = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};
