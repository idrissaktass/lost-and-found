import dbConnect from '../../utils/dbConnect';
import Listing from '../../models/Listing';
import Cors from 'cors';

const cors = Cors({
  origin: 'https://www.lostandfound.website',
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

  res.setHeader('Access-Control-Allow-Origin', 'https://www.lostandfound.website');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // No content for OPTIONS method
  }

  await dbConnect();

  const { id } = req.query;

  try {
    const listingItem = await Listing.findById(id).populate('createdBy', 'name');
    if (!listingItem) {
      return res.status(404).json({ message: 'Listing item not found' });
    }
    return res.status(200).json(listingItem);
  } catch (error) {
    console.error("Error fetching Listing item:", error);
    return res.status(500).json({ message: 'Failed to fetch Listing item', error });
  }
}
