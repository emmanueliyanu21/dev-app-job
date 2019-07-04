const express = require('express');
const router = express.Router();
const User = require('../../models/Users');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Posts = require('../../models/Posts');
const Category = require('../../models/Category');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req, res) => {
    Posts.find({}).then(posts => {
        Category.find({}).then(categories => {
            res.render('home/index', { posts: posts, categories: categories });
        });
    });
});

router.get('/about', (req, res) => {
    res.render('home/about');
});

router.get('/login', (req, res) => {
    res.render('home/login');
});

//APP login

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {

    User.findOne({ email: email }).then(user => {
        if (!user) return done(null, false, { message: 'No user found' });
        bcrypt.compare(password, user.password, (err, matched) => {
            if (err) return err;
            if (matched) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password.' });
            }
        });
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

// Logout here
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});

// Register route
router.get('/register', (req, res) => {
    res.render('home/register');
});

// Post route
router.get('/post/:id', (req, res) => {
    Posts.findOne({ _id: req.params.id })
        .then(post => {
            Category.find({}).then(categories => {
                res.render('home/post', { post: post, categories: categories });
            });

        });
});

// Register Login

router.post('/register', (req, res) => {

    let errors = [];

    if (!req.body.firstName) {
        errors.push({ message: 'please add first name' });
    }
    if (!req.body.lastName) {
        errors.push({ message: 'please add last name' });
    }
    if (!req.body.email) {
        errors.push({ message: 'please include email' });
    }
    if (!req.body.password !== !req.body.confirmPassword) {
        errors.push({ message: 'password field dont match' });
    }
    if (errors.length > 0) {
        res.render('home/register', {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        })
    } else {
        User.findOne({ email: req.body.email }).then(user => {
            if (!user) {
                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                });
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash("newUser.password", salt, function(err, hash) {
                        newUser.password = hash;
                        newUser.save().then(savedUser => {
                            req.flash('success_message', 'You are now registered, please login')
                            res.redirect('/login')
                        });
                        // Store hash in your password DB.
                    });
                });
            } else {
                req.flash('error_message', 'That email exist please login');
                res.redirect('/login');
            }
        });
    }
});

module.exports = router;