if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

console.log(process.env.SECRET);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const password=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const passport = require("passport");
const userRouter =require("./routes/user.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const { error } = require('console');




const dburl=process.env.ATLASDB_URL;


async function main() {
    try {
        await mongoose.connect(dburl);
        console.log("Connected to db");
    } catch (err) {
        console.log("Database connection error:", err);
    }
}

main();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static('public'));

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24 * 3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
  res.locals.currUser=req.user;
    next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter);



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
