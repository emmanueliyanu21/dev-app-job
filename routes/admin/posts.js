const express = require('express');
const router = express.Router();
const Post = require('../../models/Posts');
const Category = require('../../models/Category');
const { isEmpty } = require('../../helpers/upload-helpers');
const fs = require('fs');
const path = require('path');
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
    Post.find({})
    .populate('category')
    .then(posts => {
        res.render('admin/posts', { posts: posts });
    });
});

router.get('/create', (req, res) => {
    Category.find({}).then(categories=>{
        res.render('admin/posts/create', {categories: categories});
    });        
});

// editing our data 
router.get('/edit/:id', (req, res) => {
    Post.findOne({ _id: req.params.id }).then(post => {
        Category.find({}).then(categories=>{
            res.render('admin/posts/edit', {post: post, categories: categories});
        });
    });
});

router.post('/create', (req, res) => {

    let errors = [];
    if (!req.body.title) {
        errors.push({ message: 'please add a title' });
    }
    // if (!req.body.file) {
    //     errors.push({ message: 'please add a file' });
    // }
    // if (!req.body.body) {
    //     errors.push({ message: 'please add description' });
    // }

    if (errors.length > 0) {
        res.render('admin/posts/create', {
            errors: errors
        });
    } else {
        let filename = 'BMW';
        if (!isEmpty(req.files)) {
            let file = req.files.file;
            filename = Date.now() + '-' + file.name;
            file.mv('./public/uploads/' + filename, (err) => {
                if (err) throw err;
            });
        }

        // let allowComments = true;
        // if (req.body.allowComments) {
        //     allowComments = true;
        // } else {
        //     allowComments = false;
        // }

        const newPost = new Post({
            title: req.body.title,
            file: filename,
            amount: req.body.amount,
            location: req.body.location,
            status: req.body.status,
            category: req.body.category,
            body: req.body.body
        });

        newPost.save().then(savedPost => {
            req.flash('success_message', `Post ${savedPost.title} was created successfully`);
            // console.log('DATA WAS GOOD')
            res.redirect('/admin/posts');
        }).catch(error => {
            console.log('could not save post');
        });

    }

    //console.log(req.body);
});


router.put('/edit/:id', (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {

            let allowComments = true;
            if (req.body.allowComments) {
                allowComments = true;
            } else {
                allowComments = false;
            }

            post.title = req.body.title;
            post.amount = req.body.amount;
            post.location = req.body.location;
            post.status = req.body.status;
            post.allowComments = allowComments;
            post.category = req.body.category;
            post.body = req.body.body;
            post.save().then(updatedPost => {
                res.redirect('/admin/posts');
            });
        });
});

router.delete('/:id', (req, res) => {
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
            res.redirect('/admin/posts');
        });
});

// router.delete('/:id', (req, res) => {
//     Post.findOne({ _id: req.params.id })
//         .populate(comments)
//         .then(post => {
//             fs.unlink(uploadDir + post.file, (err) => {
//                 if (!post.comments.length < 1) {
//                     post.comments.forEach(comment => {
//                         comment.remove();
//                     });
//                 }
//                 post.remove().then(postRemoved => {
//                     req.flash('success_message', 'Post was successfully deleted');
//                     res.redirect('/admin/posts');
//                 })
//             })
//         })
// });

module.exports = router;