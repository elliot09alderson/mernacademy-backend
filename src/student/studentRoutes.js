import express from "express";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "./studentController.js";
import {
  studentSignup,
  studentLogin,
  studentLogout,
  getStudentProfile,
  updateStudentProfile,
  changePassword,
  deleteStudentAccount
} from "./studentAuthController.js";
import { protectStudent, checkStudentOwnership } from "../middleware/studentAuth.js";
import {
  validateStudent,
  studentSignupSchema,
  studentLoginSchema,
  studentUpdateSchema,
  studentChangePasswordSchema
} from "../validations/studentValidation.js";

const router = express.Router();

// Public routes
router.post("/signup", validateStudent(studentSignupSchema), studentSignup);
router.post("/login", validateStudent(studentLoginSchema), studentLogin);

// Protected routes (require authentication)
router.use(protectStudent); // All routes after this middleware are protected

router.post("/logout", studentLogout);
router.get("/profile", getStudentProfile);
router.put("/profile", validateStudent(studentUpdateSchema), updateStudentProfile);
router.put("/change-password", validateStudent(studentChangePasswordSchema), changePassword);
router.delete("/account", deleteStudentAccount);

// Admin routes (existing CRUD operations - these should be protected by admin middleware in the future)
router.post("/", createStudent);
router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;