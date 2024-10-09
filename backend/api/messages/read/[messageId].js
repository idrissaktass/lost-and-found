import dbConnect from '../../../utils/dbConnect';
import Message from '../../../models/Message';
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
    return res.status(204).end(); // No content for OPTIONS method
  }

  await dbConnect();

  const { messageId } = req.query;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.read = true;
    await message.save();

    res.status(200).json({ message: 'Message marked as read' });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
}
