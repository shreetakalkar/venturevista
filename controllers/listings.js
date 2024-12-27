const Listing = require("../models/listing");
const axios = require("axios");
const ExpressError = require("../utils/ExpressError");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};



module.exports.showListings = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }

    let coordinates = { lat: 28.6139, lng: 77.2090 }; // Default to a location (e.g., Delhi, India)

    if (listing.location && listing.country) {
        try {
            const locationQuery = `${encodeURIComponent(listing.location)}, ${encodeURIComponent(listing.country)}`;
            const response = await axios.get(
                `https://api.maptiler.com/geocoding/${locationQuery}.json`,
                {
                    params: { key: process.env.MAPTILER_API_KEY }
                }
            );
            if (response.data.features.length > 0) {
                const [lng, lat] = response.data.features[0].geometry.coordinates;
                coordinates = { lat, lng };
            }
        } catch (error) {
            console.error("Geocoding error:", error.message);
        }
    }

    res.render("listings/show.ejs", { listing, coordinates });
};


module.exports.createListing = async (req, res) => {
    const { path: url, filename } = req.file || {};

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (url && filename) {
        newListing.image = { url, filename };
    }

    await newListing.save();
    req.flash("success", "New Listing created");
    return res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }

    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
        const { path: url, filename } = req.file;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing updated");
    return res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }

    req.flash("success", "Listing deleted");
    return res.redirect("/listings");
};
