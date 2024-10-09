// api/messages/read.js
import dbConnect from '../../utils/dbConnect';
import Message from '../../models/Message';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'PUT') {
    const { messageId } = req.query;

    try {
      const message = await Message.findByIdAndUpdate(messageId, { read: true }, { new: true });

      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update message' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
