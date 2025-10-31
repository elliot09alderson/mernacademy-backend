import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for branch images
const branchStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mernacademy/branches',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }]
  }
});

// Create multer upload middleware for multiple branch images
export const uploadBranchImages = multer({
  storage: branchStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Configure Cloudinary storage for outstanding student images
const studentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mernacademy/outstanding-students',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'fill', gravity: 'face' }]
  }
});

// Create multer upload middleware for single student image
export const uploadStudentImage = multer({
  storage: studentStorage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB max file size
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Configure Cloudinary storage for event images
const eventStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mernacademy/events',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }]
  }
});

// Create multer upload middleware for single event image
export const uploadEventImage = multer({
  storage: eventStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Configure Cloudinary storage for faculty images
const facultyStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mernacademy/faculty',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'fill', gravity: 'face' }]
  }
});

// Create multer upload middleware for single faculty image
export const uploadFacultyImage = multer({
  storage: facultyStorage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB max file size
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper function to delete images from Cloudinary
export const deleteCloudinaryImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
};

// Helper function to delete multiple images
export const deleteMultipleCloudinaryImages = async (publicIds) => {
  try {
    const deletePromises = publicIds.map(publicId =>
      cloudinary.uploader.destroy(publicId)
    );
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error('Error deleting images from Cloudinary:', error);
    return false;
  }
};

export default cloudinary;
