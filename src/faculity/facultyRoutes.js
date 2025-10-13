import express from "express";
import {
  facultySignup,
  facultyLogin,
  facultyLogout,
  getFacultyProfile
} from "./facultyController.js";
import { protectFaculty } from "../middleware/facultyAuth.js";

const router = express.Router();

// Public routes
router.post('/signup', facultySignup);
router.post('/login', facultyLogin);

// Protected routes (require authentication)
router.use(protectFaculty); // All routes after this middleware are protected

router.post('/logout', facultyLogout);
router.get('/profile', getFacultyProfile);

export default router;