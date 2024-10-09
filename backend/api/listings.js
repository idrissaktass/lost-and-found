import dbConnect from '../utils/dbConnect';
import Listing from '../models/Listing';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';
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

cloudinary.v2.config({ 
  cloud_name: 'daiuzirml', 
  api_key: '275313194368981', 
  api_secret: 'jnjQWJjuKNRtGgOy4H9bKZpKvb8'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'listings',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === 'OPTIONS') {
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
