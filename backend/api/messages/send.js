import dbConnect from '../../utils/dbConnect';
import Message from '../../models/Message';
import User from '../../models/User';
import Cors from 'cors';

const cors = Cors({
  origin: 'https://www.lostandfoundtr.online',
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
    return res.status(204).end(); // No content for OPTIONS method
  }

  await dbConnect();

  if (req.method === 'POST') {
    const { senderName, recipientUsername, content } = req.body;

    try {
      const sender = await User.findOne({ username: senderName });
      if (!sender) {
        return res.status(404).json({ error: 'Sender not found' });
      }

      const recipient = await User.findOne({ username: recipientUsername });
      if (!recipient) {
        return res.status(404).json({ error: 'Recipient not found' });
      }

      const message = new Message({
        sender: sender._id,
        recipient: recipient._id,
        content,
        timestamp: new Date(),
      });

      await message.save();
      res.status(201).json({ message });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save message' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
