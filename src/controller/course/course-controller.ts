import { Response } from "express";
import { IAuthRequest } from "../../middleware/auth-middleware";
import Course from "../../database/model/course-model";
import Category from "../../database/model/category-model";

class CourseController {
  static async addCourse(req: IAuthRequest, res: Response) {
    try {
      //  Get logged-in user
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      //  Get data from body
      const { courseName, courseDescription, courseDuration, categoryId } =
        req.body;

      //  Validate input
      if (!courseName || !courseDescription || !courseDuration || !categoryId) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      //  Check if category exists
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      // Create course
      const course = await Course.create({
        courseName,
        courseDescription,
        courseDuration,
        categoryId,
        createdBy: userId,
      });

      //  Success response
      return res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: course,
      });
    } catch (error) {
      console.error("Add Course Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

export default CourseController;
