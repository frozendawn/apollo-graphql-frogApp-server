const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
}, {versionKey: false});


const User = new mongoose.model('User', userSchema);

module.exports = User;