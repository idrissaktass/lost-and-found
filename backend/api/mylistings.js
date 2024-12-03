import dbConnect from '../utils/dbConnect';
import Listing from '../models/Listing'; // Ensure you have this model defined correctly
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';
import Cors from 'cors';

const cors = Cors({
  origin: 'https://www.lostandfoundtr.online',
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
    res.setHeader('Access-Control-Allow-Origin', 'https://www.lostandfoundtr.online');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end(); // No content for OPTIONS method
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
    const username = req.query.username;

    try {
      const listings = await Listing.find({ createdBy: username }).sort({ createdAt: -1 });
      res.status(200).json(listings);
    } catch (error) {
      console.error("Failed to fetch user listings:", error);
      res.status(500).json({ message: 'Failed to fetch user listings', error });
    }
  }

}
