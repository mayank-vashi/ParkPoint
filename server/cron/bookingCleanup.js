const cron = require('node-cron');
const Booking = require('../models/Booking');

function startBookingCleanup() {
  // Runs every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      const result = await Booking.deleteMany({
        endTime: { $lte: now },
        checkinStatus: false
      });

    } catch (err) {
      console.error("Error while cleaning expired bookings:", err.message);
    }
  });
}

module.exports = startBookingCleanup;
