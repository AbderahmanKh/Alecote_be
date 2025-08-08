const Booking = require('../models/Booking');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const acceptedBookings = await Booking.countDocuments({ status: 'accepted' });
    const declinedBookings = await Booking.countDocuments({ status: 'declined' });

    res.json({
      totalBookings,
      pendingBookings,
      acceptedBookings,
      declinedBookings
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};