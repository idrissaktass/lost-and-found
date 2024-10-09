import { getUnread, send, read, getAllMessages, getMessagesBetween } from './messages';
import express from 'express'; 
import cors from 'cors'; 

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

// Other middleware
app.use(express.json()); // For parsing application/json

export default async function handler(req, res) {
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
      // Execute both functions for GET requests regardless of parameters
      const { username } = req.query;

      if (username) {
        // Call both functions
        try {
          const unreadResponse = await getUnread(req, res);
          const allMessagesResponse = await getAllMessages(req, res);

          // Combine responses
          const combinedResponse = {
            unreadMessages: unreadResponse?.unreadMessages || [],
            allMessages: allMessagesResponse?.messages || [],
          };

          return res.status(200).json(combinedResponse);
        } catch (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      } else {
        return res.status(400).json({ error: 'Username query parameter is required' });
      }

    default:
      res.setHeader('Allow', ['POST', 'PUT', 'GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
