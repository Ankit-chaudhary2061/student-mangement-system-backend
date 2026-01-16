import express from "express";
import AuthController from "../controller/auth/auth-controller";
import AuthMiddleware, { UserRole } from "../middleware/auth-middleware";
import CourseController from "../controller/course/course-controller";

const router = express.Router(); 

// course routes
router.post("/course", AuthMiddleware.isLogedIn,AuthMiddleware.restrictTo(UserRole.ADMIN, UserRole.TEACHER), CourseController.addCourse);


export default router;
