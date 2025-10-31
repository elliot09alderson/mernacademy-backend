import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  image: {
    url: {
      type: String,
      required: false
    },
    publicId: {
      type: String,
      required: false
    }
  },
  specialization: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  expertise: [{
    type: String,
    trim: true
  }],
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  research: [{
    title: String,
    description: String,
    publishedDate: Date,
    journal: String
  }],
  achievements: [{
    title: String,
    description: String,
    date: Date
  }],
  officeHours: {
    type: String,
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

facultySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Faculty = mongoose.model('Faculty', facultySchema);

export default Faculty;