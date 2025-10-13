import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
    maxlength: [100, "Full name cannot exceed 100 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email"
    ]
  },
  phonenumber: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    match: [
      /^[\+]?[1-9][\d]{9,14}$/,
      "Please enter a valid phone number"
    ]
  },
  qualification: {
    type: String,
    required: [true, "Qualification is required"],
    trim: true,
    maxlength: [100, "Qualification cannot exceed 100 characters"]
  },
  hereaboutus: {
    type: String,
    required: [true, "Please tell us how you heard about us"],
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update last login
studentSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save({ validateBeforeSave: false });
};

export const StudentModel = mongoose.model("Student", studentSchema);
