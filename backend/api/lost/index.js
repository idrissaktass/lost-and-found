import express from 'express';
import Cors from 'cors';
import getLost from './get';
// Import other route files if needed

const app = express();
const router = express.Router();

// CORS configuration
const corsOptions = {
  origin: 'https://lost-and-found-lovat.vercel.app', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Apply CORS to all routes
app.use(Cors(corsOptions));

// Add routes
router.use('/get', getLost);
// Add other routes as needed

app.use('/api/lost', router);

export default app;
