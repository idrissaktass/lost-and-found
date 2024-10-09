import express from 'express';
import Listing from '../models/Listing';
import Cors from 'cors';

const router = express.Router();

const cors = Cors({
    origin: 'https://movie-app-x.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

router.get('/', async (req, res) => {
    const username = req.query.username;
    
    await runMiddleware(req, res, cors);

    try {
        const listings = await Listing.find({ createdBy: username }).sort({ createdAt: -1 });
        res.status(200).json(listings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user listings', error });
    }
});

export default router;
