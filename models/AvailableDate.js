const mongoose = require('mongoose');

const availableDateSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
    get: (v) => v.toISOString().split('T')[0] // Store as YYYY-MM-DD
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('AvailableDate', availableDateSchema);