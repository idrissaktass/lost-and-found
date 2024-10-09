const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Lost = require('../models/Lost');
const router = express.Router();

cloudinary.config({ 
    cloud_name: 'daiuzirml', 
    api_key: '275313194368981', 
    api_secret: 'jnjQWJjuKNRtGgOy4H9bKZpKvb8'
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'losts', 
        allowed_formats: ['jpg', 'png', 'jpeg'], 
    },
});

const upload = multer({ storage: storage });

router.post('/', upload.array('images', 5), async (req, res) => { 
    const { title, description, category, location, createdBy, type } = req.body;
    console.log("body",req.body)
    try {
        const newLost = new Lost({ title, description, category, location, createdBy, type });

        if (req.files) {
            newLost.images = req.files.map(file => file.path);
        }

        await newLost.save();
        res.status(201).json(newLost);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create lost', error });
    }
});


router.get('/', async (req, res) => {
    try {
        const losts = await Lost.find().populate('createdBy', 'name'); 
        res.status(200).json(losts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch losts', error });
    }
});

module.exports = router;
