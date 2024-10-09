import express from 'express';
import Lost from '../models/Lost';
import dbConnect from '../utils/dbConnect';
import Cors from 'cors';

const router = express.Router();
const cors = Cors({
  origin: 'https://your-frontend-url.com',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

async function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

router.get('/:id', async (req, res) => {
  await runMiddleware(req, res, cors);

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://your-frontend-url.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  try {
    await dbConnect();
    const lost = await Lost.findById(req.params.id).populate('createdBy', 'name');
    if (!lost) {
      return res.status(404).json({ message: 'lost not found' });
    }
    res.status(200).json(lost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch lost', error });
  }
});

export default router;
