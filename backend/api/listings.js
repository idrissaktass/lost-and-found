import dbConnect from '../utils/dbConnect';
import Listing from '../models/Listing'; // Adjust the path as necessary
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';
import Cors from 'cors';

// CORS configuration
const cors = Cors({
  origin: 'https://movie-app-x.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

// Helper method to allow middleware like CORS
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

// Configuration for Cloudinary
cloudinary.v2.config({ 
  cloud_name: 'daiuzirml', 
  api_key: '275313194368981', 
  api_secret: 'jnjQWJjuKNRtGgOy4H9bKZpKvb8' // Be cautious with sensitive data
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'listings', // The name of the folder in your Cloudinary account
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed image formats
  },
});

const upload = multer({ storage: storage });

export default async function handler(req, res) {
  // Ensure CORS is set up first
  await runMiddleware(req, res, cors);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://movie-app-frontend-xi.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  // Connect to the database
  try {
    console.log("Connecting to the database...");
    await dbConnect();
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({ error: "Database connection error" });
  }

  if (req.method === 'POST') {
    await upload.array('images', 5)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Image upload failed', error: err });
      }

      const { title, description, category, location, createdBy, type } = req.body;
      console.log("body", req.body);

      try {
        const newListing = new Listing({ title, description, category, location, createdBy, type });

        if (req.files) {
          newListing.images = req.files.map(file => file.path);
        }

        await newListing.save();
        res.status(201).json(newListing);
      } catch (error) {
        res.status(500).json({ message: 'Failed to create listing', error });
      }
    });
  } else if (req.method === 'GET') {
    try {
      const listings = await Listing.find().populate('createdBy', 'name');
      res.status(200).json(listings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch listings', error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
