import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';
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

cloudinary.config({
  cloud_name: 'daiuzirml',
  api_key: '275313194368981',
  api_secret: 'jnjQWJjuKNRtGgOy4H9bKZpKvb8'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'losts',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

router.post('/', upload.array('images', 5), async (req, res) => {
  await runMiddleware(req, res, cors);

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://lost-and-found-lovat.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  await dbConnect();
  const { title, description, category, location, createdBy, type } = req.body;

  try {
    const newLost = new Lost({ title, description, category, location, createdBy, type });

    if (req.files) {
      newLost.images = req.files.map(file => file.path);
    }

    await newLost.save();
    res.status(201).json(newLost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create lost', error });
  }
});

router.get('/', async (req, res) => {
  await dbConnect();
  try {
    const losts = await Lost.find().populate('createdBy', 'name');
    res.status(200).json(losts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch losts', error });
  }
});

export default router;
