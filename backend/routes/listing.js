const express = require('express');
const Listing = require('../models/Listing');
const router = express.Router();

router.get('/:id', async (req, res) => {
    console.log("Received request for ID:", req.params.id);
    try {
        const listing = await Listing.findById(req.params.id).populate('createdBy', 'name');
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        console.log("Fetched listing:", listing);
        res.status(200).json(listing);
    } catch (error) {
        console.error("Error fetching listing:", error); 
        res.status(500).json({ message: 'Failed to fetch listing', error });
    }
});

module.exports = router;
