import Faculty from "./facultyModel.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN, JWT_COOKIE_EXPIRES_IN } from "../config/env.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN || '7d',
  });
};

// Create and send token with cookie
const createSendToken = (faculty, statusCode, res) => {
  const token = generateToken(faculty._id);

  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true, // prevent JS access
    secure: process.env.NODE_ENV === "production", // only true in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  faculty.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      faculty
    }
  });
};

// Faculty Signup
export const facultySignup = async (req, res, next) => {
  try {
    const { fullname, email, password, specialization, phonenumber } = req.body;

    // Check if faculty already exists
    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) {
      return res.status(400).json({
        status: 'fail',
        message: 'Faculty with this email already exists'
      });
    }

    // Create new faculty
    const newFaculty = await Faculty.create({
      fullname,
      email,
      password,
      specialization,
      phonenumber
    });

    createSendToken(newFaculty, 201, res);
  } catch (error) {
    console.error('Faculty Signup Error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        status: 'fail',
        message: 'Faculty with this email already exists'
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'fail',
        message: 'Validation Error',
        errors
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong during signup'
    });
  }
};

// Faculty Login
export const facultyLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // Check if faculty exists and password is correct
    const faculty = await Faculty.findOne({ email }).select('+password');

    if (!faculty || !(await faculty.comparePassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    // Check if faculty is active
    if (!faculty.isActive) {
      return res.status(401).json({
        status: 'fail',
        message: 'Your account has been deactivated. Please contact administrator.'
      });
    }

    createSendToken(faculty, 200, res);
  } catch (error) {
    console.error('Faculty Login Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong during login'
    });
  }
};

// Faculty Logout
export const facultyLogout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

// Get Faculty Profile
export const getFacultyProfile = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.faculty.id);

    if (!faculty) {
      return res.status(404).json({
        status: 'fail',
        message: 'Faculty not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        faculty
      }
    });
  } catch (error) {
    console.error('Get Faculty Profile Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong while fetching profile'
    });
  }
};