import mongoose from 'mongoose';

const courseInquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
    trim: true
  },
  hereAboutUs: {
    type: String,
    required: [true, 'Please tell us how you heard about us'],
    enum: ['linkedin', 'friend', 'college', 'poster', 'website', 'googlemap', 'other']
  },
  message: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'enrolled', 'rejected'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

courseInquirySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const CourseInquiry = mongoose.model('CourseInquiry', courseInquirySchema);

export default CourseInquiry;
