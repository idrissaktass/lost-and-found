// api/index.js
import { getUnread } from './messages';
import { send, read, getAllMessages, getMessagesBetween } from './messages';
import express from 'express'; // or require('express')
import cors from 'cors'; // Import CORS

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'https://lost-and-found-lovat.vercel.app', // your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Use CORS middleware
app.use(cors(corsOptions));

// Other middleware and routes
app.use(express.json()); // For parsing application/json

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://lost-and-found-lovat.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method } = req;

  switch (method) {
    case 'POST':
      return send(req, res);
    case 'PUT':
      return read(req, res);
    case 'GET':
      if (req.query.recipient) {
        return getMessagesBetween(req, res); // When both username and recipient are provided
      }
      if (req.query.username) {
        // Differentiate between fetching all messages and unread messages
        const unread = req.query.unread === 'true'; // Check for an unread query parameter
        return unread ? getUnread(req, res) : getAllMessages(req, res); // Handle accordingly
      }
      return res.status(405).end(`Method ${method} Not Allowed`);
    default:
      res.setHeader('Allow', ['POST', 'PUT', 'GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
