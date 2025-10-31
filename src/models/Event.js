import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    enum: ['academic', 'cultural', 'sports', 'technical', 'workshop', 'seminar', 'other'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  organizer: {
    type: String,
    required: true
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
  images: [{
    url: String,
    publicId: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  category: {
    type: String,
    enum: ['Academic', 'Cultural', 'Sports', 'Technical', 'Workshop', 'Seminar', 'Other'],
    required: true
  },
  registrationLink: {
    type: String,
    required: false
  },
  maxParticipants: {
    type: Number,
    required: false
  },
  registeredParticipants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Event = mongoose.model('Event', eventSchema);

export default Event;