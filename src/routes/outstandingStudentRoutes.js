import express from 'express';
import {
  createOutstandingStudent,
  getAllOutstandingStudents,
  getOutstandingStudent,
  updateOutstandingStudent,
  deleteOutstandingStudent,
  toggleStudentStatus
} from '../controllers/outstandingStudentController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { uploadStudentImage } from '../config/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/', getAllOutstandingStudents);
router.get('/:id', getOutstandingStudent);

// Admin only routes
router.post(
  '/',
  authenticate,
  isAdmin,
  uploadStudentImage.single('image'),
  createOutstandingStudent
);

router.put(
  '/:id',
  authenticate,
  isAdmin,
  uploadStudentImage.single('image'),
  updateOutstandingStudent
);

router.delete(
  '/:id',
  authenticate,
  isAdmin,
  deleteOutstandingStudent
);

router.patch(
  '/:id/toggle-status',
  authenticate,
  isAdmin,
  toggleStudentStatus
);

export default router;
