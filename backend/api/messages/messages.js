import dbConnect from './utils/dbConnect';
import Message from './models/Message';
import User from './models/User';

export const getUnread = async (req, res) => {
  const { username } = req.query;

  try {
    await dbConnect();
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

    res.setHeader('Access-Control-Allow-Origin', 'https://lost-and-found-frontend-mu.vercel.app');
    res.status(200).json({ unreadMessages });
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    res.setHeader('Access-Control-Allow-Origin', 'https://lost-and-found-frontend-mu.vercel.app');
    res.status(500).json({ error: 'Failed to fetch unread messages' });
  }
};

export const send = async (req, res) => {
  const { senderName, recipientUsername, content } = req.body;

  try {
    await dbConnect();
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
    res.setHeader('Access-Control-Allow-Origin', 'https://lost-and-found-frontend-mu.vercel.app');
    res.status(201).json({ message });
  } catch (error) {
    console.error('Error saving message:', error);
    res.setHeader('Access-Control-Allow-Origin', 'https://lost-and-found-frontend-mu.vercel.app');
    res.status(500).json({ error: 'Failed to save message' });
  }
};

export const read = async (req, res) => {
  const { messageId } = req.params;

  try {
    await dbConnect();
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.read = true;
    await message.save();

    res.setHeader('Access-Control-Allow-Origin', 'https://lost-and-found-frontend-mu.vercel.app');
    res.status(200).json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.setHeader('Access-Control-Allow-Origin', 'https://lost-and-found-frontend-mu.vercel.app');
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
};

export const getMessagesBetweenUsers = async (req, res) => {
  const { username, recipient } = req.params;

  try {
    await dbConnect();
    const user = await User.findOne({ username });
    const recipientUser = await User.findOne({ username: recipient });

    if (!user || !recipientUser) {
      console.error('User or Recipient not found');
      return res.status(404).json({ error: 'User not found' });
    }

    const messages = await Message.find({
      $or: [
        { sender: user._id, recipient: recipientUser._id },
        { sender: recipientUser._id, recipient: user._id },
      ],
    }).populate('sender', 'username').populate('recipient', 'username');

    res.setHeader('Access-Control-Allow-Origin', 'https://lost-and-found-frontend-mu.vercel.app');
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.setHeader('Access-Control-Allow-Origin', 'https://lost-and-found-frontend-mu.vercel.app');
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
