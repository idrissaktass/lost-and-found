const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

router.post('/send', async (req, res) => {
    const { senderName, recipientUsername, content } = req.body;

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

    try {
        await message.save();
        res.status(201).json({ message });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save message' });
    }
});

router.get('/:username/:recipient', async (req, res) => {
    const username = req.params.username;
    const recipientUsername = req.params.recipient;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const recipient = await User.findOne({ username: recipientUsername });
        if (!recipient) {
            return res.status(404).json({ error: 'Recipient not found' });
        }

        const messages = await Message.find({
            $or: [
                { sender: user._id, recipient: recipient._id },
                { sender: recipient._id, recipient: user._id }
            ]
        })
        .populate('sender', 'username')
        .populate('recipient', 'username');

        res.status(200).json(messages);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:username/unread', async (req, res) => {
    const username = req.params.username;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const unreadMessages = await Message.find({
            recipient: user._id,
            read: false 
        })
        .populate('sender', 'username')
        .populate('recipient', 'username'); 

        res.status(200).json({ unreadMessages });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const messages = await Message.find({
            $or: [
                { sender: user._id },
                { recipient: user._id }
            ]
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

module.exports = router;
