import express from 'express'; 
import cors from 'cors'; 
import { getUnread, send, read, getMessagesBetweenUsers } from './messages';
import { lostId } from './lost';
import { listingId } from './listing';

const app = express();

const corsOptions = {
    origin: 'https://www.lostandfoundtr.online/',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.post('/api/messages/send', send);
app.get('/api/messages/getUnread', getUnread);
app.get('/api/messages/:username/:recipient', getMessagesBetweenUsers);
app.put('/api/messages/read/:messageId', read);
app.get('/api/lost/:id', lostId);
app.get('/api/listing/:id', listingId);

export default app;
