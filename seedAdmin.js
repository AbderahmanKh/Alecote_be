require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

mongoose.connect(process.env.MONGODB_URI);

const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'admin@alecote.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return process.exit(0);
    }

    // Don't hash manually - let the model's pre-save hook do it
    const admin = new Admin({
      email: 'admin@alecote.com',
      password: 'admin123' // Plain text - model will hash it
    });

    await admin.save();
    console.log('✅ Admin created successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
    process.exit(1);
  }
};

seedAdmin();