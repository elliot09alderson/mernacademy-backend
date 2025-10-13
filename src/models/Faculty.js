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