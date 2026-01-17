import express from "express";
import AuthMiddleware, { UserRole } from "../middleware/auth-middleware";
import TeacherController from "../controller/teacher/teacher-controller";
import { storage } from "../middleware/cloudinary-middleware";
import multer from "multer";

const router = express.Router();

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// Teacher routes
router.post(
  "/teacher",
  AuthMiddleware.isLogedIn,
  AuthMiddleware.restrictTo(UserRole.ADMIN),
  upload.single("image"),
  TeacherController.addTeacher
);

// Get all teachers
router.get(
  "/teachers",
  AuthMiddleware.isLogedIn,
  AuthMiddleware.restrictTo(UserRole.ADMIN),
  TeacherController.getAllTeacher
);

// Get a single teacher by ID
router.get(
  "/teacher/:id",
  AuthMiddleware.isLogedIn,
  AuthMiddleware.restrictTo(UserRole.ADMIN),
  TeacherController.getSingleTeacher
);

// Delete a teacher by ID
router.delete(
  "/teacher/:id",
  AuthMiddleware.isLogedIn,
  AuthMiddleware.restrictTo(UserRole.ADMIN),
  TeacherController.deleteTeacher
);

export default router;
