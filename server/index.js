// server/index.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const cors = require('cors');

const startBookingCleanup = require('./cron/bookingCleanup'); 
startBookingCleanup();

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/slots', require('./routes/slot'));
app.use('/api/bookings', require('./routes/booking'));
app.use("/api/payments", require("./routes/paymentRoutes.js"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

