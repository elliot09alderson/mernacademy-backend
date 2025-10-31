import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

// Load environment variables
dotenv.config();

const ADMIN_CREDENTIALS = {
  email: 'admin@mernacademy.com',
  password: 'Admin@123',
  name: 'Super Admin',
  phone: '+1234567890',
  role: 'admin'
};

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingUser = await User.findOne({ email: ADMIN_CREDENTIALS.email });

    if (existingUser) {
      console.log('\n⚠️  Admin user already exists!');
      console.log('Email:', ADMIN_CREDENTIALS.email);

      // Check if admin record exists
      const existingAdmin = await Admin.findOne({ userId: existingUser._id });
      if (!existingAdmin) {
        // Create admin record for existing user
        const adminId = `ADM${Date.now()}`;
        await Admin.create({
          userId: existingUser._id,
          adminId,
          department: 'Administration',
          permissions: [
            'manage_users',
            'manage_students',
            'manage_faculty',
            'manage_courses',
            'manage_branches',
            'manage_events',
            'view_reports',
            'manage_settings'
          ],
          isSuperAdmin: true
        });
        console.log('✅ Admin record created for existing user');
      } else {
        console.log('✅ Admin record already exists');
      }
    } else {
      // Create new admin user
      const user = await User.create({
        name: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email,
        password: ADMIN_CREDENTIALS.password,
        role: ADMIN_CREDENTIALS.role,
        phone: ADMIN_CREDENTIALS.phone,
        isActive: true
      });

      console.log('✅ Admin user created successfully');

      // Create admin record
      const adminId = `ADM${Date.now()}`;
      await Admin.create({
        userId: user._id,
        adminId,
        department: 'Administration',
        permissions: [
          'manage_users',
          'manage_students',
          'manage_faculty',
          'manage_courses',
          'manage_branches',
          'manage_events',
          'view_reports',
          'manage_settings'
        ],
        isSuperAdmin: true
      });

      console.log('✅ Admin record created successfully');
    }

    console.log('\n========================================');
    console.log('   ADMIN CREDENTIALS');
    console.log('========================================');
    console.log('Email:    ', ADMIN_CREDENTIALS.email);
    console.log('Password: ', ADMIN_CREDENTIALS.password);
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

seedAdmin();
