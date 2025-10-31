import express from 'express';
import {
  createFaculty,
  getAllFaculty,
  getActiveFaculty,
  getFaculty,
  updateFaculty,
  deleteFaculty,
  toggleFacultyStatus
} from '../controllers/facultyManagementController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { uploadFacultyImage } from '../config/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveFaculty);
router.get('/:id', getFaculty);

// Admin routes
router.post('/', authenticate, isAdmin, uploadFacultyImage.single('image'), createFaculty);
router.get('/', authenticate, isAdmin, getAllFaculty);
router.put('/:id', authenticate, isAdmin, updateFaculty);
router.delete('/:id', authenticate, isAdmin, deleteFaculty);
router.patch('/:id/toggle-status', authenticate, isAdmin, toggleFacultyStatus);

export default router;
