import jwt from "jsonwebtoken";
import { StudentModel } from "../student/studentModel.js";
import { JWT_SECRET } from "../config/env.js";

// Protect routes - Authentication middleware
export const protectStudent = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.studentJwt) {
      token = req.cookies.studentJwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.'
      });
    }

    // 2) Verification token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3) Check if student still exists
    const currentStudent = await StudentModel.findById(decoded.id);
    if (!currentStudent) {
      return res.status(401).json({
        status: 'fail',
        message: 'The student belonging to this token does no longer exist.'
      });
    }

    // 4) Check if student is active
    if (!currentStudent.isActive) {
      return res.status(401).json({
        status: 'fail',
        message: 'Your account has been deactivated. Please contact administrator.'
      });
    }

    // Grant access to protected route
    req.student = currentStudent;
    next();
  } catch (error) {
    console.error('Student Auth Error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token. Please log in again!'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Your token has expired! Please log in again.'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong during authentication'
    });
  }
};

// Authorization middleware - restrict to specific roles (if needed in future)
export const restrictStudentTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.student.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

// Check if student is logged in (for optional authentication)
export const isStudentLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.studentJwt) {
      const decoded = jwt.verify(req.cookies.studentJwt, JWT_SECRET);
      const currentStudent = await StudentModel.findById(decoded.id);

      if (currentStudent && currentStudent.isActive) {
        req.student = currentStudent;
      }
    }
  } catch (error) {
    // No error handling needed - this is optional authentication
  }
  next();
};

// Middleware to check if student owns the resource
export const checkStudentOwnership = (resourceIdField = 'id') => {
  return (req, res, next) => {
    const resourceId = req.params[resourceIdField];
    const studentId = req.student.id;

    if (resourceId !== studentId) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only access your own resources'
      });
    }
    next();
  };
};