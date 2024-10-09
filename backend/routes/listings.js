const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Listing = require('../models/Listing'); // Adjust the path as necessary
const router = express.Router();

// Configuration for Cloudinary
cloudinary.config({ 
    cloud_name: 'daiuzirml', 
    api_key: '275313194368981', 
    api_secret: 'jnjQWJjuKNRtGgOy4H9bKZpKvb8' // Click 'View API Keys' above to copy your API secret
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'listings', // The name of the folder in your Cloudinary account
        allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed image formats
    },
});

const upload = multer({ storage: storage });

router.post('/', upload.array('images', 5), async (req, res) => { 
    const { title, description, category, location, createdBy, type } = req.body;
    console.log("body",req.body)
    try {
        const newListing = new Listing({ title, description, category, location, createdBy, type });

        if (req.files) {
            newListing.images = req.files.map(file => file.path);
        }

        await newListing.save();
        res.status(201).json(newListing);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create listing', error });
    }
});


router.get('/', async (req, res) => {
    try {
        const listings = await Listing.find().populate('createdBy', 'name');
        res.status(200).json(listings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch listings', error });
    }
});


module.exports = router;
