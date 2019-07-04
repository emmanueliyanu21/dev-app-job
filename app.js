 const express = require('express');
 const app = express();
 const path = require('path');
 const exphbs = require('express-handlebars');
 const mongoose = require('mongoose');
 const bodyParser = require('body-parser');
 const methodOverride = require('method-override');
 const upload = require('express-fileupload');
 const session = require('express-session');
 const flash = require('connect-flash');
 const { mongoDbUrl } = require('./config/database');
 const passport = require('passport');

 mongoose.Promise = global.Promise;

 mongoose.connect(mongoDbUrl, { useNewUrlParser: true }).then(db => {
     console.log('MONGO conected');
 }).catch(error => console.log("COULD NOT CONNECT" + error));


 const { select } = require('./helpers/handlebars-helpers');

 // set engine
 app.engine('handlebars', exphbs({ defaultLayout: 'home', helpers: { select: select } }));
 app.set('view engine', 'handlebars');
 app.use(express.static(path.join(__dirname, 'public')));

 // bodyparser
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(bodyParser.json());

 //session
 app.use(session({
     secret: 'keyboard cat',
     resave: false,
     saveUninitialized: true,
 }));

 // flash
 app.use(flash());

 // Flash messages here
 app.use((req, res, next) => {
     res.locals.user = req.user || null;
     res.locals.success_message = req.flash('success_message');
     res.locals.error_message = req.flash('error_message');
     res.locals.error = req.flash('error');
     next();
 });

 // Passport 
 app.use(passport.initialize());
 app.use(passport.session());

 //upload file
 app.use(upload());

 // Method override
 app.use(methodOverride('_method'));

 // Load routes 
 const home = require('./routes/home/main');
 const admin = require('./routes/admin/main');
 const posts = require('./routes/admin/posts');
 const categories = require('./routes/admin/categories');
 const comments = require('./routes/admin/comments');

 // Use Routes 
 app.use('/', home);
 app.use('/admin', admin);
 app.use('/admin/posts', posts);
 app.use('/admin/categories', categories);
 app.use('/admin/comments', comments);

 app.listen(4500, () => {
     console.log(`listening on port 4500`);
 });