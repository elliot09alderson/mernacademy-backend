import jwt from "jsonwebtoken";
import Faculty from "../faculity/facultyModel.js";
import { JWT_SECRET } from "../config/env.js";

// Protect routes - Authentication middleware
export const protectFaculty = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.'
      });
    }

    // 2) Verification token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3) Check if faculty still exists
    const currentFaculty = await Faculty.findById(decoded.id);
    if (!currentFaculty) {
      return res.status(401).json({
        status: 'fail',
        message: 'The faculty belonging to this token does no longer exist.'
      });
    }

    // 4) Check if faculty is active
    if (!currentFaculty.isActive) {
      return res.status(401).json({
        status: 'fail',
        message: 'Your account has been deactivated. Please contact administrator.'
      });
    }

    // Grant access to protected route
    req.faculty = currentFaculty;
    next();
  } catch (error) {
    console.error('Faculty Auth Error:', error);

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
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.faculty.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

// Check if faculty is logged in (for optional authentication)
export const isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decoded = jwt.verify(req.cookies.jwt, JWT_SECRET);
      const currentFaculty = await Faculty.findById(decoded.id);

      if (currentFaculty && currentFaculty.isActive) {
        req.faculty = currentFaculty;
      }
    }
  } catch (error) {
    // No error handling needed - this is optional authentication
  }
  next();
};