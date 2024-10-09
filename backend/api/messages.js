import express from 'express';
import cors from 'cors';
import dbConnect from '../utils/dbConnect';
import Message from '../models/Message';
import User from '../models/User';

const router = express.Router();

const corsOptions = {
  origin: 'https://lost-and-found-lovat.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

router.use(cors(corsOptions)); // Apply CORS globally

router.use(async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // No content for OPTIONS method
  }

  try {
    console.log("Connecting to the database...");
    await dbConnect();
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({ error: "Database connection error" });
  }
  next();
});


// Send a message
router.post('/send', async (req, res) => {
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
});

// Get messages between users
router.get('/:username/:recipient', async (req, res) => {
  const { username, recipient } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const recipientUser = await User.findOne({ username: recipient });
    if (!recipientUser) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const messages = await Message.find({
      $or: [
        { sender: user._id, recipient: recipientUser._id },
        { sender: recipientUser._id, recipient: user._id },
      ],
    })
    .populate('sender', 'username')
    .populate('recipient', 'username');

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get unread messages for a user
router.get('/:username/unread', async (req, res) => {
  const { username } = req.params;

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

    res.status(200).json({ unreadMessages });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get messages for a user
router.get('/:username', async (req, res) => {
  const { username } = req.params;

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
    res.status(400).json({ error: error.message });
  }
});

// Mark a message as read
router.put('/read/:messageId', async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message.findByIdAndUpdate(messageId, { read: true }, { new: true });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

export default router;
