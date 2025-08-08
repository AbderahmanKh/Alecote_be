const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const dateController = require('../controllers/dateController');

router.get('/', dateController.getAvailableDates);

router.post(
  '/',
  auth,
  [check('date', 'Date is required').not().isEmpty()],
  dateController.addAvailableDate
);

router.delete('/:id', auth, dateController.removeAvailableDate);

module.exports = router;