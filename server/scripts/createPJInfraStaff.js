const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createPJInfraStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ep_project');
    console.log('✅ Connected to MongoDB');
    console.log('📍 Database:', process.env.MONGODB_URI ? 'MongoDB Atlas' : 'Local MongoDB');

    // P&J INFRA Staff members with admin access
    const staffMembers = [
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@pjinfra.com',
        password: 'password',
        phone: '+91 9876543211',
        company: 'P&J INFRA',
        role: 'admin',
        isActive: true
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@pjinfra.com',
        password: 'password',
        phone: '+91 9876543212',
        company: 'P&J INFRA',
        role: 'admin',
        isActive: true
      },
      {
        name: 'Amit Patel',
        email: 'amit.patel@pjinfra.com',
        password: 'password',
        phone: '+91 9876543213',
        company: 'P&J INFRA',
        role: 'admin',
        isActive: true
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@pjinfra.com',
        password: 'password',
        phone: '+91 9876543214',
        company: 'P&J INFRA',
        role: 'admin',
        isActive: true
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.singh@pjinfra.com',
        password: 'password',
        phone: '+91 9876543215',
        company: 'P&J INFRA',
        role: 'admin',
        isActive: true
      }
    ];

    console.log('\n🔧 Creating P&J INFRA Staff Members with Admin Access...\n');

    let created = 0;
    let skipped = 0;

    for (const staffData of staffMembers) {
      // Check if staff already exists
      const existingStaff = await User.findOne({ email: staffData.email });
      
      if (existingStaff) {
        console.log(`⚠️  ${staffData.name} (${staffData.email}) already exists - skipping`);
        skipped++;
      } else {
        const staff = new User(staffData);
        await staff.save();
        console.log(`✅ Created: ${staffData.name} (${staffData.email}) - Role: ${staffData.role}`);
        created++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Created: ${created} staff member(s)`);
    console.log(`   ⚠️  Skipped: ${skipped} existing member(s)`);
    console.log(`   📧 Email domain: @pjinfra.com`);
    console.log(`   🔑 Password: password (same for all)`);
    console.log(`   👔 Role: admin (can access admin dashboard)`);
    console.log(`   🎯 Access: Can view and manage all requests`);

    console.log('\n🔐 Login Credentials:');
    staffMembers.forEach(staff => {
      console.log(`   📧 ${staff.email} / 🔑 password`);
    });

    console.log('\n✅ Staff creation completed!\n');

  } catch (error) {
    console.error('❌ Error creating staff members:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB\n');
  }
};

// Run the function
createPJInfraStaff();
