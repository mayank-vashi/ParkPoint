// server/routes/booking.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Slot = require('../models/slot');
const auth = require('../middleware/auth');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");

// 📌 Book a slot
// Helper function to convert "HH:mm" to Date object today with that time

router.post('/searchAvailable/:isAdmin', auth, async (req, res) => {
  const { slotId, curStart,curEnd } = req.body;

  try {
    const booking = await Booking.findOne({
      slot: slotId,
      startTime: { $lt: curEnd },
      endTime: { $gt: curStart }    // booking ends **after** the interval starts
    });
    
    let adminFilter=0;
    if(req.params.isAdmin === "true"){
      adminFilter = await Booking.findOne({
        slot: slotId,
        checkinStatus:true   // booking ends **after** the interval starts
      });
    }

    if(booking || adminFilter)
      res.json(true);
    else
      res.json(false);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Search failed(inner)', message: err.message });
  }
});

router.post('/book/:isAdmin', auth, async (req, res) => {
  const { name,email,vehicleNumber,vehicleType,vehicleModel,slotId,startTime, endTime } = req.body;

  try {
    if(req.params.isAdmin === "true"){
      let userId=new mongoose.Types.ObjectId(); // dummy user id
      let user = await User.findOne({ email: email });
      if(user)
        userId=user._id
      else{
        user = await User.create({
          name:name,
          email:email,
          vehicleNumber:vehicleNumber,
          vehicleType:vehicleType,
          vehicleModel:vehicleModel
        });

        user = await User.findOne({ email: email });
        userId=user._id;
      }
  
      const booking = await Booking.create({
        user: userId, // dummy user id
        slot:slotId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        checkinStatus:true
      });
      res.json({ message: 'Slot booked successfully',booking});

    }
    else{
      const booking = await Booking.create({
        user: req.user.id,
        slot:slotId,
        startTime: new Date(startTime),
        endTime: new Date(endTime)
      });
      res.json({ message: 'Slot booked successfully',booking});
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Booking failed(inner)', message: err.message });
  }
});


// ❌ Cancel Booking
router.delete('/:bookingId', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.bookingId).populate('user','_id password').exec();
    if(booking.user.password=="NA")
      await User.findByIdAndDelete(booking.user._id);
    
    res.json({ message: 'Booking cancelled' });

  } catch (err) {
    res.status(500).json({ error: 'Cancel failed', message: err.message });
  }
});

router.post('/check/:slotId', auth, async (req, res) => {
  try {
    const slot = await Booking.findOne({slot:req.params.slotId,checkinStatus:true});
    
    res.json(slot);

  } catch (err) {
    res.status(500).json({ error: 'Check failed', message: err.message });
  }
});

router.post('/changeCheckinStatus/:bookingId', auth, async (req, res) => {

  try {

    const checkin = await Booking.findById(req.params.bookingId);
    checkin.checkinStatus=true;
    await checkin.save();

    res.json(checkin);

  } catch (err) {
    res.status(500).json({ error: 'Failed to change checkin status(inner)', message: err.message });
  }
});

// 📋 Get My Bookings
router.get('/my/:checkinStatus', auth, async (req, res) => {
  try {
    const booking = await Booking.find({ user: req.user.id,checkinStatus:req.params.checkinStatus })
    .populate('slot','slotNumber')
    .exec();

    const validBookings = booking.filter(b => b.slot !== null);
      res.json(validBookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/all/:checkinStatus', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admin can view all bookings' });
  }

  try {
    let bookings; 
    if(req.params.checkinStatus === 'false') {
      bookings = await Booking.find({checkinStatus:req.params.checkinStatus,startTime: { $lte: new Date() }, endTime: { $gte: new Date } })
        .populate('user', 'name email vehicleNumber vehicleType vehicleModel')
        .populate('slot', 'slotNumber')
        .exec();
    }
    else{
      bookings = await Booking.find({checkinStatus:req.params.checkinStatus})
        .populate('user', 'name email vehicleNumber vehicleType vehicleModel')
        .populate('slot', 'slotNumber')
        .exec();
    }

      const validBookings = bookings.filter(b => b.slot !== null);  //if slot is deleted but booking exists
      res.json(validBookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});


module.exports = router;
