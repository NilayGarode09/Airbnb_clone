
const User = require("../models/user.js");

module.exports.renderSignUpFrom =(req, res) => {
    res.render("users/signup.ejs");
}


module.exports.signup= async (req, res) => {
try{
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("sucess", "Welcome to Airbnb!");
            res.redirect("/listings");
    })
    // console.log(registeredUser);
    
}catch(er){
    console.log("error");
    req.flash("error",er.message);
    res.redirect("/signup");
}     
}

module.exports.renderLoginForm =(req, res) => {
    res.render("users/login.ejs");
}


module.exports.login =(req, res) => {
    req.flash("sucess", "Welcome to Airbnb! You are logged in.");
    const redirectUrl = res.locals.redirectUrl || "/listings"; 
    res.redirect(redirectUrl);
}


module.exports.logout =(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("sucess","you are logged out");
        res.redirect("/listings");
    })
}