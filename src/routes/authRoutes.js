import express from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  registerSchema,
  loginSchema,
  changePasswordSchema
} from '../validations/authValidation.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/change-password', authenticate, validateRequest(changePasswordSchema), changePassword);

export default router;