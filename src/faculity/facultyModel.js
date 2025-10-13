import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const facultySchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false
  },
  specialization: {
    type: String,
    required: [true, "Specialization is required"],
    trim: true,
    maxlength: [100, "Specialization cannot exceed 100 characters"]
  },
  phonenumber: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    match: [
      /^[\+]?[1-9][\d]{0,15}$/,
      "Please enter a valid phone number"
    ]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
facultySchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Update the updatedAt field before saving
facultySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password method
facultySchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Faculty = mongoose.model('Faculty', facultySchema);

export default Faculty;