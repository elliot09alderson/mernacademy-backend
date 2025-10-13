import { StudentModel } from "./studentModel.js";
import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_COOKIE_EXPIRES_IN,
} from "../config/env.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// Create and send token with cookie
const createSendToken = (student, statusCode, res) => {
  const token = generateToken(student._id);

  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  };

  res.cookie("studentJwt", token, cookieOptions);

  // Remove password from output
  student.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      student,
    },
  });
};

// Student Signup
export const studentSignup = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phonenumber,
      qualification,
      hereaboutus,
      password,
    } = req.body;

    // Check if student already exists
    const existingStudent = await StudentModel.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        status: "fail",
        message: "Student with this email already exists",
      });
    }

    // Create new student
    const newStudent = await StudentModel.create({
      fullname,
      email,
      phonenumber,
      qualification,
      hereaboutus,
      password,
    });

    createSendToken(newStudent, 201, res);
  } catch (error) {
    console.error("Student Signup Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Student with this email already exists",
      });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: "fail",
        message: "Validation Error",
        errors,
      });
    }

    res.status(500).json({
      status: "error",
      message: "Something went wrong during signup",
    });
  }
};

// Student Login
export const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    // Check if student exists and password is correct
    const student = await StudentModel.findOne({ email }).select("+password");

    if (!student || !(await student.comparePassword(password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    // Check if student is active
    if (!student.isActive) {
      return res.status(401).json({
        status: "fail",
        message:
          "Your account has been deactivated. Please contact administrator.",
      });
    }

    // Update last login
    await student.updateLastLogin();

    createSendToken(student, 200, res);
  } catch (error) {
    console.error("Student Login Error:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong during login",
    });
  }
};

// Student Logout
export const studentLogout = (req, res) => {
  res.cookie("studentJwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

// Get Student Profile
export const getStudentProfile = async (req, res) => {
  try {
    const student = await StudentModel.findById(req.student.id);

    if (!student) {
      return res.status(404).json({
        status: "fail",
        message: "Student not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        student,
      },
    });
  } catch (error) {
    console.error("Get Student Profile Error:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching profile",
    });
  }
};

// Update Student Profile
export const updateStudentProfile = async (req, res) => {
  try {
    const { fullname, phonenumber, qualification, hereaboutus } = req.body;

    const updatedStudent = await StudentModel.findByIdAndUpdate(
      req.student.id,
      {
        ...(fullname && { fullname }),
        ...(phonenumber && { phonenumber }),
        ...(qualification && { qualification }),
        ...(hereaboutus && { hereaboutus }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        status: "fail",
        message: "Student not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        student: updatedStudent,
      },
    });
  } catch (error) {
    console.error("Update Student Profile Error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: "fail",
        message: "Validation Error",
        errors,
      });
    }

    res.status(500).json({
      status: "error",
      message: "Something went wrong while updating profile",
    });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get student with password
    const student = await StudentModel.findById(req.student.id).select(
      "+password"
    );

    if (!student) {
      return res.status(404).json({
        status: "fail",
        message: "Student not found",
      });
    }

    // Check if current password is correct
    if (!(await student.comparePassword(currentPassword))) {
      return res.status(400).json({
        status: "fail",
        message: "Current password is incorrect",
      });
    }

    // Update password
    student.password = newPassword;
    await student.save();

    res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while changing password",
    });
  }
};

// Delete Student Account
export const deleteStudentAccount = async (req, res) => {
  try {
    const student = await StudentModel.findByIdAndUpdate(
      req.student.id,
      { isActive: false },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        status: "fail",
        message: "Student not found",
      });
    }

    // Clear cookie
    res.cookie("studentJwt", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      status: "success",
      message: "Account deactivated successfully",
    });
  } catch (error) {
    console.error("Delete Student Account Error:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while deactivating account",
    });
  }
};
