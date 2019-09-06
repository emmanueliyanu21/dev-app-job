const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({

    category: {
        type: Schema.Types.ObjectId,
        req: 'categories'
    },

    title: {
        type: String,
        required: true
    },

    amount: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        default: 'public'
    },

    allowComments: {
        type: Boolean,
        require: true
    },

    body: {
        type: String,
        require: true
    },

    stack: {
        type: String,
        require: true
    },

    experience: {
        type: String,
        require: true
    },

    file: {
        type: String,
    },

    date: {
        type: Date,
        // default: Date.new()
    },

    comments: [{
        type: Schema.Types.ObjectId,
        req: 'comments'
    }],

}, { usePushEach: true });  // i don't understand this part

module.exports = mongoose.model('posts', PostSchema);