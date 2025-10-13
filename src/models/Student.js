import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  rollNumber: {
    type: String,
    required: true
  },
  admissionYear: {
    type: Number,
    required: true
  },
  currentSemester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  gpa: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  attendance: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  guardianName: {
    type: String,
    required: true
  },
  guardianContact: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: false
  },
  isOutstanding: {
    type: Boolean,
    default: false
  },
  achievements: [{
    title: String,
    description: String,
    date: Date,
    category: {
      type: String,
      enum: ['academic', 'sports', 'cultural', 'technical', 'other']
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Student = mongoose.model('Student', studentSchema);

export default Student;