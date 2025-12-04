import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Faculty from '../models/Faculty.js';
import User from '../models/User.js';
import Branch from '../models/Branch.js';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

const sampleFaculty = [
  {
    employeeId: 'FAC001',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@mernacademy.com',
    specialization: 'Artificial Intelligence',
    qualification: 'Ph.D. in Computer Science',
    experience: 12,
    expertise: ['Machine Learning', 'Deep Learning', 'Neural Networks', 'Python'],
    image: {
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
      publicId: 'faculty/sarah-johnson'
    },
    isActive: true
  },
  {
    employeeId: 'FAC002',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@mernacademy.com',
    specialization: 'Cloud Computing',
    qualification: 'M.Tech in Cloud Architecture',
    experience: 15,
    expertise: ['AWS', 'Azure', 'DevOps', 'Docker', 'Kubernetes'],
    image: {
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
      publicId: 'faculty/michael-chen'
    },
    isActive: true
  },
  {
    employeeId: 'FAC003',
    name: 'Dr. Emily Williams',
    email: 'emily.williams@mernacademy.com',
    specialization: 'Data Science',
    qualification: 'Ph.D. in Statistics',
    experience: 8,
    expertise: ['Data Analysis', 'R', 'Statistics', 'Big Data', 'Tableau'],
    image: {
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      publicId: 'faculty/emily-williams'
    },
    isActive: true
  },
  {
    employeeId: 'FAC004',
    name: 'Prof. David Miller',
    email: 'david.miller@mernacademy.com',
    specialization: 'Cybersecurity',
    qualification: 'M.S. in Cybersecurity',
    experience: 10,
    expertise: ['Network Security', 'Ethical Hacking', 'Cryptography', 'Security Auditing'],
    image: {
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      publicId: 'faculty/david-miller'
    },
    isActive: true
  },
  {
    employeeId: 'FAC005',
    name: 'Dr. Jessica Davis',
    email: 'jessica.davis@mernacademy.com',
    specialization: 'Software Engineering',
    qualification: 'Ph.D. in Software Engineering',
    experience: 14,
    expertise: ['Software Architecture', 'Agile Methodologies', 'System Design', 'Java'],
    image: {
      url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      publicId: 'faculty/jessica-davis'
    },
    isActive: true
  },
  {
    employeeId: 'FAC006',
    name: 'Prof. Robert Wilson',
    email: 'robert.wilson@mernacademy.com',
    specialization: 'Web Development',
    qualification: 'M.Tech in Computer Science',
    experience: 9,
    expertise: ['Full Stack Development', 'React', 'Node.js', 'MongoDB', 'JavaScript'],
    image: {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      publicId: 'faculty/robert-wilson'
    },
    isActive: true
  }
];

const seedFaculty = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get or create a default branch
    let branch = await Branch.findOne({ branchCode: 'CSE' });
    if (!branch) {
      branch = await Branch.create({
        branchName: 'Computer Science & Engineering',
        branchCode: 'CSE',
        description: 'Department of Computer Science and Engineering',
        totalSeats: 120,
        availableSeats: 120,
        images: [{
          url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          publicId: 'branches/cse-default'
        }]
      });
      console.log('✅ Created default CSE branch');
    } else {
      console.log('ℹ️  Using existing CSE branch');
    }

    let createdCount = 0;
    let skippedCount = 0;

    // Default password for faculty users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Faculty@123', salt);

    for (const facultyData of sampleFaculty) {
      // Check if faculty already exists
      const existingFaculty = await Faculty.findOne({ email: facultyData.email });
      
      if (existingFaculty) {
        console.log(`⚠️  Faculty ${facultyData.name} already exists. Skipping.`);
        skippedCount++;
        continue;
      }

      // Check if user exists, if not create one
      let user = await User.findOne({ email: facultyData.email });
      if (!user) {
        user = await User.create({
          name: facultyData.name,
          email: facultyData.email,
          password: hashedPassword,
          role: 'faculty',
          isActive: true,
          branchId: branch._id // Link to the branch
        });
        console.log(`✅ Created user for: ${facultyData.name}`);
      }

      // Create faculty with userId
      await Faculty.create({
        ...facultyData,
        userId: user._id
      });
      console.log(`✅ Created faculty: ${facultyData.name}`);
      createdCount++;
    }

    console.log('\n========================================');
    console.log('   FACULTY SEEDING SUMMARY');
    console.log('========================================');
    console.log(`Created: ${createdCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Error seeding faculty:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

seedFaculty();
