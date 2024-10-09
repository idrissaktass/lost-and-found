import dbConnect from '../utils/dbConnect';
import Listing from '../models/Listing';
import Cors from 'cors';

const cors = Cors({
  origin: 'https://lost-and-found-lovat.vercel.app',
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

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://lost-and-found-lovat.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  try {
    console.log("Connecting to the database...");
    await dbConnect();
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({ error: "Database connection error" });
  }

  if (req.method === 'GET') {
    const { id } = req.query; 

    console.log("Received request for ID:", id);
    try {
      const listing = await Listing.findById(id).populate('createdBy', 'name');
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
      console.log("Fetched listing:", listing);
      res.status(200).json(listing);
    } catch (error) {
      console.error("Error fetching listing:", error);
      res.status(500).json({ message: 'Failed to fetch listing', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
