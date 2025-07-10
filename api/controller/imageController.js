const express = require('express');
const imageController = express.Router();
const ImageModel = require('../model/ImageModel');

// Upload route
imageController.post('/upload', async (req, res) => {
    console.log("Everything is yes ");
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: 'No image provided' });
    const savedImage = await ImageModel.create({ image });
    //savedImage.save();
    res.status(201).json({ message: 'Image uploaded', url: savedImage.image });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

module.exports = { imageController };
