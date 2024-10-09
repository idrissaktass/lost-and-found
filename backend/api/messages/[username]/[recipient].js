import dbConnect from '../../../utils/dbConnect';
import Message from '../../../models/Message';
import User from '../../../models/User';
import Cors from 'cors';

const cors = Cors({
  origin: 'https://lost-and-found-frontend-mu.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://lost-and-found-frontend-mu.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  await dbConnect();

  const { username, recipient } = req.query;

  console.log(`Fetching messages for user: ${username} with recipient: ${recipient}`);

  try {
    const user = await User.findOne({ username });
    const recipientUser = await User.findOne({ username: recipient });

    if (!user || !recipientUser) {
      console.error('User or Recipient not found');
      res.setHeader('Access-Control-Allow-Origin', 'https://lost-and-found-frontend-mu.vercel.app');
      return res.status(404).json({ error: 'User not found' });
    }

    const messages = await Message.find({
      $or: [
        { sender: user._id, recipient: recipientUser._id },
        { sender: recipientUser._id, recipient: user._id },
      ],
    })
    .populate('sender', 'username')
    .populate('recipient', 'username');

    res.setHeader('Access-Control-Allow-Origin', 'https://lost-and-found-frontend-mu.vercel.app');
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.setHeader('Access-Control-Allow-Origin', 'https://lost-and-found-frontend-mu.vercel.app');
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}
