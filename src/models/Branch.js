import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true,
    trim: true
  },
  branchCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  departmentHead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 1
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 0
  },
  establishedYear: {
    type: Number,
    required: false
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

branchSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Branch = mongoose.model('Branch', branchSchema);

export default Branch;