const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,   // from Razorpay Dashboard
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body; // amount in INR

    const options = {
      amount: amount * 100, // amount in paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

module.exports = router;

