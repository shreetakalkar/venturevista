const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const mongoUrl = "mongodb://127.0.0.1:27017/venturevista";

async function main() {
    try {
        await mongoose.connect(mongoUrl);
        console.log("Connected to db");
    } catch (err) {
        console.log("Database connection error:", err);
    }
}

main();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
  
    next();
});


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found"));
});


// Error Handling Middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    const stack = process.env.NODE_ENV !== "production" ? err.stack : null;
    res.status(statusCode).render("error.ejs", { message, stack });
});


app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
