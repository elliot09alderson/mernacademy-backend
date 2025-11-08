import express from 'express';
import {
  createTestimonial,
  getAllTestimonials,
  getTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialStatus
} from '../controllers/testimonialController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { uploadTestimonialImage } from '../config/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/', getAllTestimonials);
router.get('/:id', getTestimonial);

// Admin only routes
router.post(
  '/',
  authenticate,
  isAdmin,
  uploadTestimonialImage.single('image'),
  createTestimonial
);

router.put(
  '/:id',
  authenticate,
  isAdmin,
  uploadTestimonialImage.single('image'),
  updateTestimonial
);

router.delete(
  '/:id',
  authenticate,
  isAdmin,
  deleteTestimonial
);

router.patch(
  '/:id/toggle-status',
  authenticate,
  isAdmin,
  toggleTestimonialStatus
);

export default router;
