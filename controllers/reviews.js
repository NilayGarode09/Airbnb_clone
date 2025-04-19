const Listing = require("../models/listings.js"); 
const Review = require("../models/review.js");


module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author =req.user._id;
    // console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    // console.log("New review saved");
    req.flash("sucess","New Review Created!");

    res.redirect(`/listings/${listing._id}`);
}


module.exports.destroyReview= async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("sucess","Review delete!");
    res.redirect(`/listings/${id}`);
}