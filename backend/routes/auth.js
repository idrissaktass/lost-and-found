const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authRoutes = express.Router();

authRoutes.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      "867452886f9520fdb7ba8721bf6d46ebc6b000123fb2bef4cb64d32407d86986",
      { expiresIn: '1h' }
    );
    
    res.status(201).json({ message: 'User created successfully', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

authRoutes.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      "867452886f9520fdb7ba8721bf6d46ebc6b000123fb2bef4cb64d32407d86986",
      { expiresIn: '1h' }
    );
    
    res.json({ token, userId: user._id, username: user.username });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = authRoutes;
