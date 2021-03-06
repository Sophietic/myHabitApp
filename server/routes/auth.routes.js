const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model.js");
const bcrypt = require("bcrypt");
const passport = require("passport"); 
const bcryptSalt = 10;

router.post("/signup", (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ message: "Please provide both your email address and password" });
    return;
  }

  if(!email.match){
    res.status(400).json({message: "Please use a valid email address."});
    return;
  }
  const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegexp.test(email)) {
    res.status(500).json({message: 'Please provide an existing email address.' });
   return;
 }

   const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
     res.status(500).json({message: 'Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  User.findOne({ email }).then((user) => {
    if (user !== null) {
      res.status(400).json({
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
    newUser.save((error) => {
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
        res.status(200).json(newUser);
      });
    });
  });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (error, aUser, errorMessage) => {
    if (error) {
      res.status(500).json({
        message: "The authentication of the user went wrong",
      });
      return;
    }
    if (!aUser) {
      res.status(401).json(errorMessage);
      return;
    }
    req.login(aUser, (error) => {
      if (error) {

        res.status(500).json({ message: "Session saving went wrong" });
        return;
      } 
      res.status(200).json(aUser);
    });
  })(req, res, next);
});

router.post("/logout", (req, res) => {
  req.logout();
  res.status(200).json({ message: "Succesfull log out!" });
});

router.get("/loggedin", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: "Unauthorized" });
});

module.exports = router;
