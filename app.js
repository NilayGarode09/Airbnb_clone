if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}

const express =require("express");
const app =express();
const path =require("path");
const Listning =require("./models/listings.js")
const methodOverride =require("method-override");
const ejsMAte =require("ejs-mate");
const wrapAsync =require("./util/wrapAsync.js");
const ExpressError =require("./util/ExpressError.js");
const {listingSchema} =require("./schema.js");
const {reviewSchema} =require("./schema.js");
const session =require("express-session");
const MongoStore = require('connect-mongo');
const Review =require("./models/review.js")
const passport =require("passport");
const LocalStrategy =require("passport-local");
const User =require("./models/user.js");
const flash = require("connect-flash");
console.log(process.env.secret);




app.set("view engine","ejs");
// app.set("views",path.join(__dirname,"views"))
app.set('views', path.join(__dirname, 'views'));  
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMAte );
app.use(express.static(path.join(__dirname,"/public")));



const listingsRouter =require("./routes/listing.js")
const reviewsRouter =require("./routes/review.js")
const userRouter =require("./routes/user.js")


const mongoose =require("mongoose");
const Listing = require("./models/listings.js");
const { rmSync } = require("fs");
const { strictEqual } = require("assert");



const dbUrl =process.env.ATLASDB_URL;


const store =MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
})
store.on("error",()=>{
    console.log("error in database",err)
})

//   const mondb_url='mongodb://127.0.0.1:27017/Airbnb'

const sessionOptions ={
    store,
    secret :process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000 ,
        maxAge: 7*24*60*60*1000,
        httpOnly :true
    }
}




  main().then(()=>console.log("connected to mongo")).catch(err => console.log(err));
  async function main() {
  await mongoose.connect(dbUrl);

}

// app.get("/testListing", async(req,res)=>{
//     let sampleListing =new Listing({
//         title:"freff",
//         description:"ferf",
//         location:"fref",
//         country:"fref",
//         image: {
//             filename: 'listingimage',
//             url: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?...'
//           },
//         price:"1200"
//     })
// await sampleListing.save();
// console.log("sample was saved");
// res.send("sucessfull");
// })




app.get("/",(req,res)=>{
    res.send("hi i am roboot");
    console.log("req recived");
})




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
  
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.sucess= req.flash("sucess");
    res.locals.error= req.flash("error");
    res.locals.currUser =req.user;

    // console.log(res.locals.sucess);
    next();
})


// app.get("/demouser",async(req,res)=>{
//     let fakeUser =new User({
//         // emali:"student@gmail.com",
//         email:"nilaygarode@gmail.com",
//         username:"delta-student", 
//     });
//     let registerUser= await User.register(fakeUser,"nilay");
//     // console.log("hi");
//     // console.log(registerUser)
//     res.send(registerUser);
// });

app.use ("/listings",listingsRouter);
app.use ("/listings/:id/reviews",reviewsRouter);
app.use ("/",userRouter);



// app.get("/listning", async(req,res)=>{
//     const listing =new Listning({
//         title:"My Home ",
//         description:"beach house",
//         price:"1200",
//         location:"nagpur",
//         country:"India"
//     })
//     await listing.save();
//     res.send("sucessfull testing");

// })


//create


// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "page not found"));
//   });
  

// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"page not found"));

// });

// delete review route 

app.use((err,req,res,next)=>{
    let {statusCode,message}= err;
    // res.status(statusCode).send(message);
     res.render("./listings/error.ejs");

});



app.listen(8080,()=>{
    console.log("server listning on 8080");
});



//     <% if (currUser && currUser._id.toString() === list.owner._id.toString()) { %>
// <% } %>