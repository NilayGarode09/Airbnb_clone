const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../util/wrapAsync.js");
const ExpressError = require("../util/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const{validateReview,isLoggedIn}=require("../midleware.js");
const Listing = require("../models/listings.js"); 
const Review = require("../models/review.js");
const{isReviewAuthor} =require("../midleware.js");
const reviexColtroller =require("../controllers/reviews.js")

// Create review
router.post("/", 
    isLoggedIn,validateReview, wrapAsync(reviexColtroller.createReview));

// Delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviexColtroller .destroyReview));

module.exports = router;
