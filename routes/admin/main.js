const express = require('express');
const router = express.Router();
const Post = require('../../models/Posts');
const faker = require('faker');
//const { userAuthenticated } = require('../../helpers/authentication')

// router.all('/*', userAuthenticated, (req, res, next) => {
//     req.app.locals.layout = 'admin';
//     next();
// });

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});


router.get('/', (req, res) => {
    res.render('admin/index');
});

// router.get('/dashboard', (req, res) => {
//     res.render('admin/dashboard');
// });

router.post('/generate-fake-posts', (req, res) => {
    for (let i = 0; i < req.body.amount; i++) {
        let post = new Post();
        post.title = faker.name.title();
        post.status = 'public';
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.sentence();

        post.save(function(err) {
            if (err) throw err;
        })
    }
});


module.exports = router;