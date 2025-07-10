const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  image: {
    type: String, // Store base64 string
    required: true,
  },
});

const ImageModel = mongoose.model('Image', imageSchema);
module.exports = ImageModel;
