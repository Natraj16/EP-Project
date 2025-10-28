const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ep_project');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.co.in' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('password', 10);

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.co.in',
      password: hashedPassword,
      phone: '+91 9876543210',
      company: 'EP Project Administration',
      role: 'admin'
    });

    await adminUser.save();

    console.log('\n✅ Admin user created successfully!');
    console.log('==========================================');
    console.log('Email:', adminUser.email);
    console.log('Password: password');
    console.log('Role:', adminUser.role);
    console.log('==========================================');
    console.log('\nYou can now login with these credentials.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
