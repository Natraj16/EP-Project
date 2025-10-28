const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createStaffUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ep_project');
    console.log('Connected to MongoDB');

    // Sample staff members
    const staffMembers = [
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@epproject.com',
        password: 'staff123',
        phone: '+91 9876543211',
        company: 'EP Project Staff',
        role: 'staff'
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@epproject.com',
        password: 'staff123',
        phone: '+91 9876543212',
        company: 'EP Project Staff',
        role: 'staff'
      },
      {
        name: 'Amit Patel',
        email: 'amit.patel@epproject.com',
        password: 'staff123',
        phone: '+91 9876543213',
        company: 'EP Project Staff',
        role: 'staff'
      }
    ];

    console.log('\nCreating staff members...\n');

    for (const staffData of staffMembers) {
      // Check if staff already exists
      const existingStaff = await User.findOne({ email: staffData.email });
      
      if (existingStaff) {
        console.log(`⚠️  ${staffData.name} (${staffData.email}) already exists - skipping`);
      } else {
        const staff = new User(staffData);
        await staff.save();
        console.log(`✅ Created: ${staffData.name} (${staffData.email})`);
      }
    }

    console.log('\n==========================================');
    console.log('STAFF MEMBERS CREATED');
    console.log('==========================================');
    console.log('All staff members have password: staff123');
    console.log('==========================================\n');

    // Show all staff members
    const allStaff = await User.find({ role: 'staff' });
    console.log(`Total staff members in database: ${allStaff.length}\n`);
    allStaff.forEach(staff => {
      console.log(`- ${staff.name} (${staff.email})`);
    });
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating staff users:', error);
    process.exit(1);
  }
};

createStaffUsers();
