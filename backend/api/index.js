import express from 'express'; 
import cors from 'cors'; 
import { getUnread, send, read, getMessagesBetweenUsers } from './messages';
import { lostId } from './lost';
import { listingId } from './listing';

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
app.get('/api/messages/getUnread', getUnread);
app.get('/api/messages/:username/:recipient', getMessagesBetweenUsers);
app.put('/api/messages/read/:messageId', read); // Use PUT for marking messages as read
app.post('/api/lost/:id', lostId);
app.post('/api/listing/:id', listingId);

export default app;
