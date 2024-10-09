// api/messages/getMessagesBetween.js
import dbConnect from '../../utils/dbConnect';
import Message from '../../models/Message';
import User from '../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  const { username, recipient } = req.query;

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
}
