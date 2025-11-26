import express from 'express';
import {
  createInquiry,
  getAllInquiries,
  getInquiry,
  updateInquiry,
  deleteInquiry,
  getInquiryStats
} from '../controllers/courseInquiryController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public route - anyone can submit an inquiry
router.post('/', createInquiry);

// Protected routes - admin only
router.get('/stats', authenticate, isAdmin, getInquiryStats);
router.get('/', authenticate, isAdmin, getAllInquiries);
router.get('/:id', authenticate, isAdmin, getInquiry);
router.put('/:id', authenticate, isAdmin, updateInquiry);
router.delete('/:id', authenticate, isAdmin, deleteInquiry);

export default router;
