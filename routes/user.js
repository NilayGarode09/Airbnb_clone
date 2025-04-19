const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../util/wrapAsync.js");
const flash= require("connect-flash");
const passport = require("passport");
const {saveRedirect}= require("../midleware.js");


const userColnroller= require("../controllers/users.js");

// Signup form



router.route("/signup")
.get(userColnroller.renderSignUpFrom)
.post( wrapAsync(userColnroller.signup));

router.route("/login")
.get( userColnroller.renderLoginForm)
.post(
    saveRedirect,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),    
    userColnroller.login
);

router.get("/logout",userColnroller.logout);

module.exports = router;
