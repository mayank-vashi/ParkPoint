// server/models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
    required: true
  },
  startTime: {             // new field to store booking start time
    type: Date,
    default: null
  },
  endTime: {               // new field to store booking end time
    type: Date,
    default: null
  },
  checkinStatus: {               // new field to store booking end time
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
