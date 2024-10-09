// api/index.js
import { getUnread } from './messages';
import { send, read, getAllMessages, getMessagesBetween } from './messages';

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      return send(req, res);
    case 'PUT':
      return read(req, res);
    case 'GET':
      if (req.query.recipient) {
        return getMessagesBetween(req, res); // When both username and recipient are provided
      }
      if (req.query.username) {
        return getAllMessages(req, res); // When only username is provided
      }
      if (req.query.username) {
        return getUnread(req, res); // When only username is provided
      }
      return res.status(405).end(`Method ${method} Not Allowed`);
    default:
      res.setHeader('Allow', ['POST', 'PUT', 'GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
