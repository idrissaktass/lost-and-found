// api/messages/getUnread.js
import dbConnect from '../../utils/dbConnect';
import Message from '../../models/Message';
import User from '../../models/User';

export default async function handler(req, res) {
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

    res.status(200).json({ unreadMessages });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
