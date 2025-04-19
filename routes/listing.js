const express = require("express");
const router = express.Router();
const {reviewSchema} =require("../schema.js");
const { listingSchema } = require("../schema.js");
const wrapAsync = require("../util/wrapAsync.js");
const ExpressError = require("../util/ExpressError.js");
const Listing = require("../models/listings.js"); 
const {isLoggedIn} =require("../midleware.js");
const {saveRedirect} =require("../midleware.js");
const {isOwner,validateListing} =require("../midleware.js"); 

const listingController =require("../controllers/listings.js")
const multer  = require('multer')
const {storage}= require("../cloudConfig.js")
const upload = multer({ storage })





router
.route("/")
.get( wrapAsync(listingController.index))
.post( isLoggedIn,validateListing, upload.single('listing[image]'),wrapAsync(listingController.createListing));




router.get("/new",isLoggedIn, listingController.renderNewForm);



router.route("/:id")
.get(wrapAsync(listingController.showListings))
.put( isLoggedIn,
    isOwner,
     validateListing,
     upload.single('listing[image]'),
      wrapAsync(listingController.updatingListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));
      

// New form


// Show listing
// router.get("/:id",wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const list = await Listing.findById(id).populate("reviews").populate("owner");
//     if(!list){
//         req.flash("error","Listing you requersted for dose not exist!");
//         res.redirect("/listings");
//     }
//     // console.log(list);
//     res.render("listings/show.ejs", {list});
// }));







// Create listing

// Edit form
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

// Update listing

// Delete listing

module.exports = router;
