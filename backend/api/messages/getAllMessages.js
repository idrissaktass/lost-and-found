import dbConnect from '../../utils/dbConnect';
import Message from '../../models/Message';
import User from '../../models/User';
import Cors from 'cors';

const cors = Cors({
  origin: 'https://www.lostandfound.website',
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

  const { username } = req.query;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const messages = await Message.find({
      $or: [
        { sender: user._id },
        { recipient: user._id },
      ],
    })
    .populate('sender', 'username')
    .populate('recipient', 'username');

    const unreadMessages = messages.filter(msg => msg.recipient._id.equals(user._id) && !msg.read);
    const uniqueRecipients = Array.from(new Set(
      messages.map(msg => msg.sender.username).concat(messages.map(msg => msg.recipient.username))
    )).filter(recipient => recipient !== username);

    const messageCounts = uniqueRecipients.reduce((acc, recipient) => {
      acc[recipient] = messages.filter(msg => msg.sender.username === recipient && !msg.read).length;
      return acc;
    }, {});

    res.status(200).json({ messages, unreadMessages, uniqueRecipients, messageCounts });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}
