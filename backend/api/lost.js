import express from 'express';
import Lost from '../models/Lost';
import dbConnect from '../utils/dbConnect';
import Cors from 'cors';

const router = express.Router();
const cors = Cors({
  origin: 'https://lost-and-found-lovat.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

router.use(cors);  // Apply CORS to all routes

router.options('*', cors);  // Handle preflight requests

router.get('/:id', async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    await dbConnect();
    const lost = await Lost.findById(req.params.id).populate('createdBy', 'name');
    if (!lost) {
      return res.status(404).json({ message: 'Lost item not found' });
    }
    res.status(200).json(lost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch lost item', error });
  }
});

export default router;
