import { Response } from "express";
import { IAuthRequest } from "../../middleware/auth-middleware";
import Course from "../../database/model/course-model";
import Category from "../../database/model/category-model";
import { User } from "../../database/model/user-model";

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
static async getAllCourse(req: IAuthRequest, res: Response) {
  try {
    const courses = await Course.findAll({
      include: [
        { model: User, attributes: ["id", "username"] },
        { model: Category, attributes: ["id", "categoryName"] },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "All courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    console.error("Get All Courses Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

static async getSingleCourse(req:IAuthRequest, res:Response){
    try {
        const {id} = req.params
        if(!id){
        return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
        }

        const course = await Course.findOne({ where: { id },
    include: [
        { model: User, attributes: ["id", "username"] },
        { model: Category, attributes: ["id", "categoryName"] },
      ],
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      data: course,
    });
  } catch (error) {
    console.error("Get Single Course Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
static async deleteCourse(req:IAuthRequest, res:Response){
    try {
        const{id}=req.params
        if(!id){
        return res.status(400).json({
        success: false,
        message: "course ID is required",
      });  
        }
        const data  = await Course.findOne({where:{id:id}})
        if(data){
            await Course.destroy({
                where:{id}
            })
         return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  }else{
    res.status(404).json({
      message:'no product with id '
    })
  }
    
    } catch (error) {
    console.error("Delete Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
 static async updateCourse(req: IAuthRequest, res: Response) {
  try {
    //  Normalize & validate ID
  const{id}=req.params
    const courseId = Array.isArray(id) ? id[0] : id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    //  Get data from body
    const {
      courseName,
      courseDescription,
      courseDuration,
      categoryId,
    } = req.body;

    // 3Find course
    const course = await Course.findByPk(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 4If categoryId is being updated, check if category exists
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    // Update only provided fields
    await course.update({
      courseName: courseName ?? course.courseName,
      courseDescription: courseDescription ?? course.courseDescription,
      courseDuration: courseDuration ?? course.courseDuration,
      categoryId: categoryId,
    });

    //  Success response
    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("Update Course Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

}

export default CourseController;
