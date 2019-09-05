const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CommentSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId, //i dont understand this part
        ref: 'users'
    },

    body: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },


});

module.exports = mongoose.model('comments', CommentSchema);