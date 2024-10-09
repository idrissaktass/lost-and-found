//getunread
import dbConnect from '../../utils/dbConnect';
import Message from '../../models/Message';
import User from '../../models/User';
import Cors from 'cors';

const cors = Cors({
  origin: 'https://lost-and-found-frontend-mu.vercel.app',
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

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // No content for OPTIONS method
  }

  await dbConnect();

  const { username } = req.query;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const unreadMessages = await Message.find({
      recipient: user._id,
      read: false,
    })
    .populate('sender', 'username')
    .populate('recipient', 'username');
    console.log("Unread Messages:", unreadMessages)
    res.status(200).json({ unreadMessages });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
