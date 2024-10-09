import express from 'express';
import Listing from '../models/Listing';
import Cors from 'cors';

const router = express.Router();

// CORS middleware
const cors = Cors({
    origin: 'https://lost-and-found-lovat.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});

// Apply CORS middleware to all requests
router.use(cors);

// Handle OPTIONS requests for preflight
router.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://lost-and-found-lovat.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
});

router.get('/', async (req, res) => {
    const username = req.query.username;

    try {
        const listings = await Listing.find({ createdBy: username }).sort({ createdAt: -1 });
        res.status(200).json(listings);
    } catch (error) {
        console.error("Error fetching user listings:", error); // Log the error for debugging
        res.status(500).json({ message: 'Failed to fetch user listings', error: error.message });
    }
});

export default router;
