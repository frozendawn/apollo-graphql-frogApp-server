const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  buffer: {
    type: 'Buffer',
    required: true
  }
})

const Image = new mongoose.model('Image', imageSchema);

module.exports = Image;