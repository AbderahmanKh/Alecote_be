const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.login = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  console.log('Login attempt:', { email, password }); // Debug log

  try {
    const admin = await Admin.findOne({ email });
    console.log('Admin found:', admin ? 'Yes' : 'No'); // Debug log
    
    if (!admin) {
      console.log('No admin found with email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Stored password hash:', admin.password); // Debug log
    
    const isMatch = await admin.comparePassword(password);
    console.log('Password match result:', isMatch); // Debug log
    
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      admin: {
        id: admin.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        console.log('Login successful, token generated');
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server error');
  }
};