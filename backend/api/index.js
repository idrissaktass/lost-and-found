import express from 'express'; 
import cors from 'cors'; 
import { getUnread, send, read, getAllMessages } from './messages';

const app = express();

// CORS configuration
const corsOptions = {
    origin: '*', // Allow all origins for testing
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
app.get('/api/messages/getUnread', getUnread); // Make sure to set this route correctly

export default app;
