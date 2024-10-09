const express = require('express');
const Lost = require('../models/Lost');
const router = express.Router();

router.get('/:id', async (req, res) => {
    console.log("Received request for ID:", req.params.id);
    try {
        const lost = await Lost.findById(req.params.id).populate('createdBy', 'name');
        if (!lost) {
            return res.status(404).json({ message: 'lost not found' });
        }
        console.log("Fetched lost:", lost); 
        res.status(200).json(lost);
    } catch (error) {
        console.error("Error fetching lost:", error); 
        res.status(500).json({ message: 'Failed to fetch lost', error });
    }
});

module.exports = router;
