import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  adminId: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: false,
    default: 'Administration'
  },
  permissions: [{
    type: String,
    enum: [
      'manage_users',
      'manage_students',
      'manage_faculty',
      'manage_courses',
      'manage_branches',
      'manage_events',
      'view_reports',
      'manage_settings'
    ]
  }],
  isSuperAdmin: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  accountLocked: {
    type: Boolean,
    default: false
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

adminSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
