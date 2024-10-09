import express from 'express'; 
import cors from 'cors'; 
import { getUnread, send, read, getMessagesBetweenUsers } from './messages';

const app = express();

// CORS configuration
const corsOptions = {
    origin: 'https://lost-and-found-frontend-mu.vercel.app', // your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

// Use CORS middleware
app.use(cors(corsOptions));
app.use(express.json()); // For parsing application/json

// Define your routes
app.post('/api/messages/send', send);
app.put('/api/messages/read', read);
app.get('/api/messages/getUnread', getUnread);
app.get('/api/messages/:username/:recipient', getMessagesBetweenUsers); // Add this route

export default app;
