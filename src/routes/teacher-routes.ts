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

export default router;
