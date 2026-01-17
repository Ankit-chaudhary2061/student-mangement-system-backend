import express from "express";
import CourseController from "../controller/course/course-controller";
import AuthMiddleware, { UserRole } from "../middleware/auth-middleware";

const router = express.Router();

/**
 * CREATE COURSE
 * Admin & Teacher
 */
router.post(
  "/courses",
  AuthMiddleware.isLogedIn,
  AuthMiddleware.restrictTo(UserRole.ADMIN, UserRole.TEACHER),
  CourseController.addCourse
);

/**
 * GET ALL COURSES
 * Public (Student, Teacher, Admin)
 */
router.get(
  "/courses",
  CourseController.getAllCourse
);

/**
 * GET SINGLE COURSE
 * Public
 */
router.get(
  "/courses/:id",
  CourseController.getSingleCourse
);

/**
 * UPDATE COURSE
 * Admin & Teacher
 */
router.patch(
  "/courses/:id",
  AuthMiddleware.isLogedIn,
  AuthMiddleware.restrictTo(UserRole.ADMIN, UserRole.TEACHER),
  CourseController.updateCourse
);

/**
 * DELETE COURSE
 * Admin only
 */
router.delete(
  "/courses/:id",
  AuthMiddleware.isLogedIn,
  AuthMiddleware.restrictTo(UserRole.ADMIN),
  CourseController.deleteCourse
);

export default router;
