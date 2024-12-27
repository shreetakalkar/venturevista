const path = require('path');
const User = require('../models/user'); // Import your User model

// Serve the React homepage (index.html)
module.exports.renderhomepage = (req, res) => {
    const indexPath = path.join(__dirname,'..','client', 'dist', 'index.html');
    console.log("Index Path: ", indexPath);  // Log to check the resolved path
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error("Error serving index.html:", err); // Log any errors
            res.status(500).send("Server Error");
        }
    });
};


// Logout functionality
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    });
}

// Login functionality
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back Owner");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

// Render Login Form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

// Render Signup Form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

// Render User Login Form
module.exports.renderUserLogin = (req, res) => {
    res.render("users/userlogin.ejs");
}

// Handle Signup
module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to VentureVista");
            res.redirect("/listings");
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}
