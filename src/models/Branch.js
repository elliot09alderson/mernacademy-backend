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
  address: {
    street: {
      type: String,
      required: false
    },
    city: {
      type: String,
      required: false
    },
    state: {
      type: String,
      required: false
    },
    zipCode: {
      type: String,
      required: false
    },
    country: {
      type: String,
      default: 'India'
    },
    fullAddress: {
      type: String,
      required: false
    }
  },
  contactInfo: {
    phone: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: false
    },
    alternatePhone: {
      type: String,
      required: false
    }
  },
  operatingHours: {
    weekdays: {
      type: String,
      default: 'Mon-Fri: 9:00 AM - 8:00 PM'
    },
    weekends: {
      type: String,
      default: 'Sat: 9:00 AM - 6:00 PM'
    }
  },
  facilities: [{
    type: String,
    enum: [
      '50+ Lab Computers',
      'High-Speed Wi-Fi',
      'Air Conditioned Rooms',
      'Parking Facility',
      'Cafeteria',
      'Library',
      '24/7 Security',
      'Career Counseling',
      'Projector Rooms',
      'Conference Hall',
      'Sports Facility',
      'Hostel',
      'Medical Room'
    ]
  }],
  isHeadquarters: {
    type: Boolean,
    default: false
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
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
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