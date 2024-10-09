import dbConnect from '../../utils/dbConnect';
import LostItem from '../../models/LostItem';
import Cors from 'cors';

const cors = Cors({
  origin: 'https://lost-and-found-frontend-mu.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  res.setHeader('Access-Control-Allow-Origin', 'https://lost-and-found-frontend-mu.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // No content for OPTIONS method
  }

  await dbConnect();

  const { id } = req.query;

  try {
    const lostItem = await LostItem.findById(id).populate('createdBy', 'name');
    if (!lostItem) {
      return res.status(404).json({ message: 'Lost item not found' });
    }
    return res.status(200).json(lostItem);
  } catch (error) {
    console.error("Error fetching lost item:", error);
    return res.status(500).json({ message: 'Failed to fetch lost item', error });
  }
}
