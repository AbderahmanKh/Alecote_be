// controllers/dateController.js
const AvailableDate = require('../models/AvailableDate');
const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

exports.getAvailableDates = async (req, res) => {
  try {
    // Get all available dates
    const dates = await AvailableDate.find().sort({ date: 1 });
    
    // Filter out past dates and dates that are already booked
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const availableDates = [];
    
    for (const dateObj of dates) {
      const date = new Date(dateObj.date);
      date.setHours(0, 0, 0, 0);
      
      // Skip past dates
      if (date < today) continue;
      
      // Check if this date has any accepted or pending bookings
      const existingBooking = await Booking.findOne({
        date: {
          $gte: date,
          $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000)
        },
        status: { $in: ['pending', 'accepted'] }
      });
      
      // Only include dates that are not booked
      if (!existingBooking) {
        availableDates.push(dateObj);
      }
    }
    
    res.json(availableDates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.addAvailableDate = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { date } = req.body;
    const newDateObj = new Date(date);
    
    // Validate that the date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    newDateObj.setHours(0, 0, 0, 0);
    
    if (newDateObj < today) {
      return res.status(400).json({ 
        message: 'Cannot add dates in the past' 
      });
    }

    // Check if date already exists
    const existingDate = await AvailableDate.findOne({
      date: {
        $gte: newDateObj,
        $lt: new Date(newDateObj.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existingDate) {
      return res.status(400).json({ 
        message: 'This date is already in the available dates list' 
      });
    }

    const newDate = new AvailableDate({ date: newDateObj });
    await newDate.save();
    
    res.status(201).json({
      message: 'Available date added successfully',
      date: newDate
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.removeAvailableDate = async (req, res) => {
  try {
    const dateToRemove = await AvailableDate.findById(req.params.id);
    if (!dateToRemove) {
      return res.status(404).json({ message: 'Date not found' });
    }

    // Check if this date has any pending or accepted bookings
    const dateObj = new Date(dateToRemove.date);
    dateObj.setHours(0, 0, 0, 0);
    
    const existingBooking = await Booking.findOne({
      date: {
        $gte: dateObj,
        $lt: new Date(dateObj.getTime() + 24 * 60 * 60 * 1000)
      },
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingBooking) {
      return res.status(400).json({ 
        message: 'Cannot remove date that has pending or accepted bookings' 
      });
    }

    await dateToRemove.deleteOne();
    res.json({ 
      message: 'Available date removed successfully' 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};