const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({


    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        default: 'public'
    },

    email: {
        type: String,
        require: true
    },

    password: {
        type: String,
        require: true
    },

    confirmPassword: {
        type: String,
        require: true
    },

});

// i dont understand this test method
UserSchema.methods.testMethod = function() {

};

module.exports = mongoose.model('users', UserSchema);