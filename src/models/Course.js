import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  courseCode: {
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
  duration: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    enum: ['code', 'brain', 'rocket', 'star', 'trophy', 'target'],
    default: 'code'
  },
  level: {
    type: String,
    enum: ['Beginner Friendly', 'Intermediate', 'Advanced'],
    required: true
  },
  batchSize: {
    type: String,
    enum: ['Small Batch', 'Medium Batch', 'Large Batch'],
    default: 'Small Batch'
  },
  features: [{
    type: String,
    trim: true
  }],
  originalPrice: {
    type: Number,
    required: true
  },
  discountedPrice: {
    type: Number,
    required: true
  },
  discountPercentage: {
    type: Number,
    default: 0
  },
  isLimitedOffer: {
    type: Boolean,
    default: false
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: false
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  credits: {
    type: Number,
    required: false,
    min: 1
  },
  semester: {
    type: Number,
    required: false,
    min: 1,
    max: 8
  },
  isActive: {
    type: Boolean,
    default: true
  },
  syllabus: {
    type: String,
    required: false
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
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

courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Course = mongoose.model('Course', courseSchema);

export default Course;