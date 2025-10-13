import express from 'express';
import {
  getStudent,
  getStudentByUserId,
  getAllStudents,
  getOutstandingStudents,
  getStudentsBySemester,
  updateStudent,
  updateGPA,
  updateAttendance,
  promoteStudent,
  addAchievement,
  getTopPerformers
} from '../controllers/studentController.js';
import { authenticate, isAdmin, isFaculty } from '../middleware/auth.js';

const router = express.Router();

router.get('/outstanding', getOutstandingStudents);
router.get('/top-performers', getTopPerformers);
router.get('/semester/:semester', getStudentsBySemester);
router.get('/user/:userId', authenticate, getStudentByUserId);

router.get('/', getAllStudents);
router.get('/:id', getStudent);

router.put('/:id', authenticate, isAdmin, updateStudent);
router.put('/:id/gpa', authenticate, isFaculty, updateGPA);
router.put('/:id/attendance', authenticate, isFaculty, updateAttendance);
router.post('/:id/promote', authenticate, isAdmin, promoteStudent);
router.post('/:id/achievements', authenticate, isFaculty, addAchievement);

export default router;