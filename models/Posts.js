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

}, { usePushEach: true });

module.exports = mongoose.model('posts', PostSchema);