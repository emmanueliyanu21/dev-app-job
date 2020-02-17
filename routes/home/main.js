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

//to set limit to the number of displayed data
function lookatEntireResponse(res) {
    function lookAtItemInResponse(item) {
        if(item == 1) {
            sq3.query("SELECT * from students;",
                function(err, res) {
                    if (err){
                       throw err;
                    } else {
                        if(res.length==1){
                            doSomething(item);
                            lookAtItemInResponse(res.shift());
                        } else {
                           //just don't call the next lookAtItemInResponse function, effectively same thing as "break;"
                        }
                    }
                });
            sq3.end();
        } else {
            lookAtItemInResponse(res.shift());
        }
    }
    lookAtItemInResponse(res.shift());
}

//to search for jobs
//Any conditions that apply to not populated user collection documents
// var userQuery = {};
// userModel.find(userQuery)
// 	//Populate only if the condition is fulfilled
// 	.populate('useraddress', null, {"useraddress.repeat": { $gte: _repeatTime}})
// 	.exec(function (err, results) {
// 		results = results.filter(function(doc){
// 			//If not populated it will be null, so we filter them out
// 			return !!doc.useraddress;
// 		});

// 		//Do needed stuff here.
// 	});

router.get('/jobs', (req, res) => {
    Posts.find({}).then(posts => {
        Category.find({}).then(categories => {
            res.render('home/jobs', { posts: posts, categories: categories });
        });
    });
});

router.get('/frontend', (req, res) => {
    Posts.find({}).then(posts => {
        Category.find({}).then(categories => {
            res.render('home/frontend', { posts: posts, categories: categories });
        });
    });
});

router.get('/contact', (req, res) => {
    res.render('home/contact');
});

router.get('/about', (req, res) => {
    res.render('home/about');
});

router.get('/services', (req, res) => {
    res.render('home/services');
});

router.get('/jobs', (req, res) => {
    res.render('home/jobs');
});

router.get('/frontend', (req, res) => {
    res.render('home/frontend');
});

router.get('/backend', (req, res) => {
    res.render('home/backend');
});

router.get('/fullstack', (req, res) => {
    res.render('home/fullstack');
});

router.get('/devops', (req, res) => {
    res.render('home/devops');
});

router.get('/designer', (req, res) => {
    res.render('home/designer');
});

router.get('/projectmanager', (req, res) => {
    res.render('home/projectmanager');
});

router.get('/digital-marketer', (req, res) => {
    res.render('home/digital-marketer');
});

router.get('/content', (req, res) => {
    res.render('home/content');
});

router.get('/login', (req, res) => {
    res.render('home/login');
});

router.post('/login', (req, res) => {
    res.render('admin');
});

//APP login


passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    
    User.findOne({ email: email }).then(user => {
        if (!user) return done(null, false, { message: 'No user found' });
        bcrypt.compare(password, user.password, (err, matched) => {
            if (err) return err;   
            if (matched) {
                return done(null, users);
                // console.log('it works on login');
            }    
            else {
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