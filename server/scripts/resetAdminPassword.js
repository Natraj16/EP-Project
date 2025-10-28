const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ep_project');
    console.log('Connected to MongoDB');

    // Find admin user
    let admin = await User.findOne({ email: 'admin@example.co.in' });
    
    if (!admin) {
      console.log('Admin not found. Creating new admin user...');
      admin = new User({
        name: 'Admin User',
        email: 'admin@example.co.in',
        password: 'password',
        phone: '+91 9876543210',
        company: 'EP Project Administration',
        role: 'admin',
        isActive: true
      });
    } else {
      console.log('Admin found. Resetting password...');
      // Set password - this will trigger the pre-save hook to hash it
      admin.password = 'password';
    }

    // Save - this will trigger pre-save hook to hash password
    await admin.save();

    console.log('\n✅ Admin password has been reset!');
    console.log('==========================================');
    console.log('Email: admin@example.co.in');
    console.log('Password: password');
    console.log('Role:', admin.role);
    console.log('==========================================\n');

    // Test the password
    const isValid = await admin.comparePassword('password');
    console.log('Password verification test:', isValid ? '✅ PASSED' : '❌ FAILED');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

resetAdminPassword();
