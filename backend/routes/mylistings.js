const express = require('express');
const Listing = require('../models/Listing');
const router = express.Router();

router.get('/', async (req, res) => {
    const username = req.query.username; 
    console.log("cd",username)
    try {
        const listings = await Listing.find({ createdBy: username }).sort({ createdAt: -1 });
        res.status(200).json(listings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user listings', error });
    }
});

module.exports = router;
