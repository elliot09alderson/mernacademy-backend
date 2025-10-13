import bcrypt from 'bcryptjs';
import UserRepository from '../repositories/UserRepository.js';
import StudentRepository from '../repositories/StudentRepository.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Branch from '../models/Branch.js';

class AuthService {
  async register(userData) {
    const { email, password, role, ...otherData } = userData;

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Handle branchId requirement for non-admin users
    let branchId = otherData.branchId;
    if (role !== 'admin' && !branchId) {
      // Find a default branch or create one if none exists
      let defaultBranch = await Branch.findOne({ isActive: true });

      if (!defaultBranch) {
        // Create a default branch
        defaultBranch = await Branch.create({
          branchName: 'General Studies',
          branchCode: 'GEN',
          description: 'General Studies Branch',
          totalSeats: 100,
          availableSeats: 100,
          establishedYear: new Date().getFullYear()
        });
      }

      branchId = defaultBranch._id;
    }

    const user = await UserRepository.create({
      email,
      password,
      role,
      branchId: role === 'admin' ? undefined : branchId,
      ...otherData
    });

    if (role === 'student') {
      const studentId = `STU${Date.now()}`;
      const rollNumber = `${new Date().getFullYear()}${Math.floor(Math.random() * 10000)}`;

      await Student.create({
        userId: user._id,
        studentId,
        rollNumber,
        admissionYear: new Date().getFullYear(),
        currentSemester: 1,
        guardianName: otherData.guardianName || '',
        guardianContact: otherData.guardianContact || ''
      });
    } else if (role === 'faculty') {
      const employeeId = `FAC${Date.now()}`;

      await Faculty.create({
        userId: user._id,
        employeeId,
        specialization: otherData.specialization || '',
        qualification: otherData.qualification || '',
        experience: otherData.experience || 0
      });
    }

    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token,
      refreshToken
    };
  }

  async login(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is inactive');
    }

    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branchId: user.branchId
      },
      token,
      refreshToken
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserRepository.updatePassword(userId, hashedPassword);

    return { message: 'Password updated successfully' };
  }

  async getUserProfile(userId) {
    const user = await UserRepository.findWithPopulate(userId, 'branchId enrolledCourses');
    if (!user) {
      throw new Error('User not found');
    }

    const userData = user.toObject();
    delete userData.password;

    if (user.role === 'student') {
      const studentData = await StudentRepository.findByUserId(userId);
      return { ...userData, studentDetails: studentData };
    } else if (user.role === 'faculty') {
      const facultyData = await Faculty.findOne({ userId }).populate('courses');
      return { ...userData, facultyDetails: facultyData };
    }

    return userData;
  }

  async updateProfile(userId, updateData) {
    const { password, role, ...allowedUpdates } = updateData;

    const updatedUser = await UserRepository.update(userId, allowedUpdates);
    if (!updatedUser) {
      throw new Error('User not found');
    }

    const userData = updatedUser.toObject();
    delete userData.password;

    return userData;
  }
}

export default new AuthService();