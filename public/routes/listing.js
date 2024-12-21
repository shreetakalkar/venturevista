const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../schema.js");


const validateListing = (req, res, next) => {
    const { error1 } = listingSchema.validate(req.body);
    if (error1) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// all listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//new route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

//show route
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews"); 
    res.render("listings/show.ejs", { listing });
}));

//create route
router.post("/", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing created");
    res.redirect("/listings");
}));

//edit route

router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//update route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success"," Listing updated");
    res.redirect("/listings");
}));

//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    let deletedListing = await Listing.findOneAndDelete({ _id: id }); 
    console.log(deletedListing);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
}));


module.exports=router;
