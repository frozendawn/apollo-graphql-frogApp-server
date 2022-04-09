const mongoose = require('mongoose');

const frogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
}, {versionKey: false});


const Frog = new mongoose.model('Frog', frogSchema);

module.exports = Frog;