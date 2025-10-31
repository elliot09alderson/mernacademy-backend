import mongoose from 'mongoose';

const outstandingStudentSchema = new mongoose.Schema({
  rank: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  },
  college: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  package: {
    type: String,
    required: true,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  achievement: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create index for rank to ensure uniqueness and faster queries
outstandingStudentSchema.index({ rank: 1 });

// Create index for isActive to filter active students quickly
outstandingStudentSchema.index({ isActive: 1 });

const OutstandingStudent = mongoose.model('OutstandingStudent', outstandingStudentSchema);

export default OutstandingStudent;
