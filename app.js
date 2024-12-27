if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const User = require('./models/user');
const userRouter = require('./routes/user');
const listingsRouter = require('./routes/listing');
const reviewsRouter = require('./routes/review');
const ExpressError = require('./utils/ExpressError');

// MongoDB connection
const dburl = process.env.ATLASDB_URL;
mongoose.connect(dburl)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Database connection error:', err));

// Middleware and Config
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Serve React static files
app.use(express.static(path.join(__dirname, 'client')));  // Corrected path for static files

// Session and Flash
const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: dburl,
        crypto: { secret: process.env.SECRET },
    }),
    secret: process.env.SECRET || 'fallbacksecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};
app.use(session(sessionConfig));
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash messages
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

// Routes
app.use('/listings', listingsRouter);
app.use('/listings/:id/reviews', reviewsRouter);
app.use('/', userRouter);

// Serve React homepage (index.html) for any other route
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'client', 'dist', 'index.html');
    console.log("Index Path: ", indexPath);  // Log to ensure correct path
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error("Error serving index.html:", err);  // Log error if path is incorrect
            res.status(500).send("Server Error");
        }
    });
});

// Error Handling
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render('error', { message });
});

// Server Start
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
