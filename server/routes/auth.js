// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// REGISTER USER
router.post('/register', async (req, res) => {
  const { name, email, password, address, vehicleNumber, vehicleType, vehicleModel, phone } = req.body;

  try {

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      name,
      email,
      password: hashedPassword,
      address,
      vehicleNumber,
      vehicleType,
      vehicleModel,
      phone
    });

    await user.save();
    res.json({ message: 'User registered successfully' });

  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});


// LOGIN USER
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Incorrect password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

module.exports = router;
