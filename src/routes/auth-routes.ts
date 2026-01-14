import express from "express";
import AuthController from "../controller/auth/auth-controller";

const router = express.Router(); 

// Public routes
router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);

export default router;
