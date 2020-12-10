const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model.js");
const bcrypt = require("bcrypt");
const passport = require("passport"); //voor login

const bcryptSalt = 10;

//Sign-up route
router.post("/signup", (req, res, next) => {
  const { email, password } = req.body;

  //both fields provided?
  if (!email || !password) {
    res
      .status(400)
      .json({ message: "Please provide both your email address and password" });
    return;
  }

  // if (password.length < 9) {
  //   res.status(400).json({message:"For security purposes, you password needs to be at least 10 characters"});
  //   return;
  // }
  // const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  // if (!regex.test(password)) {
  //   res
  //     .status(500)
  //     .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
  //   return;
  // }

  User.findOne({ email }).then((user) => {
    if (user !== null) {
      res
        .status(400)
        .json({
          message:
            "The email is already in use, please choose another email address",
        });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email,
      password: hashPass,
    });
    //Save user to db
    newUser.save((error) => {
      // When/If any issues arise while saving the user to the database
      if (error) {
        res
          .status(400)
          .json({ message: "Saving user to database went wrong." });
        return;
      }

      req.login(newUser, (error) => {
        if (error) {
          res.status(500).json({ message: "Login did not work" });
          return;
        }

        // Send the user's information to the frontend
        res.status(200).json(newUser);
      });
    });
  });
});

//Login route
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (error, aUser, errorMessage) => {
    if (error) {
      res.status(500).json({
        message: "The authentication of the user went wrong",
      });
      return;
    }
    if (!aUser) {
      //authentication failed
      res.status(401).json(errorMessage);
      return;
    }
    req.login(aUser, (error) => {
      if (error) {
        //session failed
        res.status(500).json({ message: "Session saving went wrong" });
        return;
      } //session successfull
      res.status(200).json(aUser);
    });
  })(req, res, next);
});

router.post("/logout", (req, res) => {
  req.logout();
  res.status(200).json({ message: "Succesfull log out!" });
});

/* LOGGEDIN */
router.get("/loggedin", (req, res, next) => {
  // req.isAuthenticated() is defined by passport
  if (req.isAuthenticated()) {
    res.status(200).json(req.user); //succesvol
    return;
  }
  res.status(403).json({ message: "Unauthorized" });
});

module.exports = router;
