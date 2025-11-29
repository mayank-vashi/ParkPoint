// server/routes/slot.js
const express = require('express');
const Slot = require('../models/slot');
const auth = require('../middleware/auth');
const router = express.Router();

// GET all slots
router.get('/', auth, async (req, res) => {
  const slots = await Slot.find();
  res.json(slots);
});

// Admin: Add new slot
router.post('/add', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admin can add slots' });
  }

  const { slotNumber } = req.body;
  try {
    const exists = await Slot.findOne({ slotNumber });
    if (exists) return res.status(400).json({ error: 'Slot already exists' });

    const slot = await Slot.create({ slotNumber });
    res.json({ message: 'Slot added successfully', slot });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// Admin: Delete slot
router.delete('/:id', auth, async (req, res) => {
  
  try {
    const data=await Slot.findByIdAndDelete(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.get('/available', async (req, res) => {
  try {
    const slots = await Slot.find({ isBooked: false });
    res.json({ slots });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
