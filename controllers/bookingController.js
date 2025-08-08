const Booking = require('../models/Booking');
const mongoose = require('mongoose'); // Add this import

exports.createBooking = async (req, res) => {
  try {
    const { fullName, email, phone, date } = req.body;
    const paymentProof = req.file ? req.file.path : null;

    const newBooking = new Booking({
      fullName,
      email,
      phone,
      date,
      paymentProof
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    console.log('Received status update:', {
      id: req.params.id,
      body: req.body
    });

    const { status } = req.body;
    
    // Validate status
    if (!status || !['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status value. Must be "accepted" or "declined"' 
      });
    }

    // Validate MongoDB ObjectId format - FIXED: Use the correct method
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid booking ID format' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id, // No need to convert, Mongoose handles it automatically
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    console.log('Updated booking:', booking);
    res.json(booking);
  } catch (err) {
    console.error('Error updating booking status:', err.message);
    
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid booking ID format' });
    }
    
    res.status(500).send('Server error');
  }
};