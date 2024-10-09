import dbConnect from '../utils/dbConnect';
import Listing from '../models/Listing';
import Cors from 'cors';

const cors = Cors({
  origin: 'https://lost-and-found-lovat.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allows credentials (cookies, etc.) to be sent
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

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://lost-and-found-lovat.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(204).end();
  }

  try {
    console.log("Connecting to the database...");
    await dbConnect();
    console.log("Database connected");

    const { id } = req.query;
    if (req.method === 'GET') {
      const listing = await Listing.findById(id).populate('createdBy', 'name');
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
      return res.status(200).json(listing);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error fetching listing:", error);
    res.status(500).json({ message: 'Failed to fetch listing', error });
  }
}
