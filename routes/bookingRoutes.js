const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const bookingController = require('../controllers/bookingController');

router.post('/', upload.single('paymentProof'), bookingController.createBooking);
router.get('/', auth, bookingController.getBookings);
router.put('/:id/status', auth, bookingController.updateBookingStatus);

module.exports = router;