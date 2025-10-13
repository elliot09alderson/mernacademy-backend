import express from 'express';
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourse,
  getAllCourses,
  getCoursesByBranch,
  getCoursesBySemester,
  assignFaculty,
  getActiveCourses
} from '../controllers/courseController.js';
import { authenticate, isAdmin, isFaculty } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createCourseSchema,
  updateCourseSchema,
  courseIdParamSchema
} from '../validations/courseValidation.js';

const router = express.Router();

router.get('/active', getActiveCourses);
router.get('/branch/:branchId', getCoursesByBranch);
router.get('/semester/:semester', getCoursesBySemester);

router.get('/', getAllCourses);
router.get('/:id', validateRequest(courseIdParamSchema), getCourse);

router.post('/', authenticate, isAdmin, validateRequest(createCourseSchema), createCourse);
router.put('/:id', authenticate, isAdmin, validateRequest(courseIdParamSchema), validateRequest(updateCourseSchema), updateCourse);
router.delete('/:id', authenticate, isAdmin, validateRequest(courseIdParamSchema), deleteCourse);
router.post('/:id/assign-faculty', authenticate, isAdmin, validateRequest(courseIdParamSchema), assignFaculty);

export default router;