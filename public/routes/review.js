const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../schema.js");



const validateReview = (req, res, next) => {
    const { error2 } = reviewSchema.validate(req.body);
    if (error2) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};


//post review route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    console.log(req.params.id);
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));


//delete review route

router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);

}));


module.exports=router;