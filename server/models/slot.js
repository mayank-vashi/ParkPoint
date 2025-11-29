const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  slotNumber: {
    type: String,
    required: true,
    unique: true
  }
  
});

module.exports = mongoose.model('Slot', SlotSchema);
