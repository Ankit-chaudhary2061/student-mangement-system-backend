import { Request, Response } from "express";
import { User } from "../../database/model/user-model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  // REGISTER
  static async registerUser(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          message: "All fields are mandatory!",
        });
      }

      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({
          message: "Email already in use",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      await User.create({
        username,
        email,
        password: hashedPassword,
      });

      return res.status(201).json({
        message: "Congratulations! Successfully registered",
      });
    } catch (error: any) {
      console.error("Register error:", error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  }

  // LOGIN
  static async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "All fields are mandatory!",
        });
      }

      const userData = await User.findOne({ where: { email } });
      if (!userData) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const passwordMatch = await bcrypt.compare(
        password,
        userData.password
      );

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const secretKey = process.env.SECRET_KEY;
      if (!secretKey) {
        return res.status(500).json({
          message: "Server configuration error",
        });
      }

      const token = jwt.sign(
        {
          id: userData.id,
        
        },
        secretKey,
        { expiresIn: "30d" }
      );

      return res.status(200).json({
        message: "Login successful",
        data: {
          token,
          username: userData.username,
          role: userData.role,
        },
      });
    } catch (error: any) {
      console.error("Login error:", error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
}

export default AuthController;
