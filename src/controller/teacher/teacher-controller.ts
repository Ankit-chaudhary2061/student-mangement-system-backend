import { Response } from "express";
import { Teacher, TeacherExpertise } from "../../database/model/teacher-model";
import { IAuthRequest, UserRole } from "../../middleware/auth-middleware";
import bcrypt from 'bcrypt'
import { User } from "../../database/model/user-model";
import { sendTeacherMail } from "../../service/node-mailer";
import { Model } from "sequelize";
import Course from "../../database/model/course-model";

class TeacherController {
  static async addTeacher(req: IAuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      const {
        teacherName,
        teacherAddress,
        teacherEmail,
        teacherExperience,
        teacherExpertise,
        teacherPhoneNumber,
        courseId,
      } = req.body;

      //basic required validation 
      if (
        !teacherName ||
        !teacherAddress ||
        !teacherEmail ||
        !teacherExperience ||
        !teacherPhoneNumber ||
        !teacherExpertise ||
        !courseId
      ) {
        return res.status(400).json({
          message: "please provide requirement details",
        });
      }

      // validate enum
      if (!Object.values(TeacherExpertise).includes(teacherExpertise)) {
        return res.status(400).json({
          message: "invalid teacher expertise",
        });
      }
            // password from teacher name
     const baseName = teacherName.split(" ")[0];
      const random = Math.floor(1000 + Math.random() * 9000);
      const tempPassword = `${baseName}@${random}`;
      const hashedPassword = await bcrypt.hash(tempPassword, 12);

      //  Create teacher login (USER)
      const teacherUser = await User.create({
        username: teacherName,
        email: teacherEmail,
        password: hashedPassword,
        role: UserRole.TEACHER,
      });
      // create teacher
      const teacher = await Teacher.create({
        userId,
        teacherName: teacherName,
        teacherEmail: teacherEmail,
        teacherAddress: teacherAddress,
        teacherExperience: teacherExperience,
        teacherExpertise: teacherExpertise as TeacherExpertise,
        teacherPhoneNumber: teacherPhoneNumber,
        courseId,
      });
       await sendTeacherMail(teacherEmail, tempPassword);
      return res.status(201).json({
        message: "teacher added successfully",
        teacher,
      });
    } catch (error: any) {
      console.error("Get All Teachers Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
  static async getAllTeacher(req:IAuthRequest, res:Response){
    try {
      const teachers  = await Teacher.findAll({
        include:[
            {
          model: User,
          attributes: ["id", "username"],
        },
        {
          model: Course,
          attributes: ["id", "courseName"], 
        },
        ]
      })

   return res.status(200).json({
        success: true,
        message: "All teachers fetched successfully",
        data: teachers,
      });
    } catch (error: any) {
      console.error("Get All Teachers Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
  // Get single teacher
  static async getSingleTeacher(req: IAuthRequest, res: Response) {
    try {
      const { id } = req.params;
    const teacherId = Array.isArray(id) ? id[0] : id;

      const teacher = await Teacher.findByPk(teacherId, {
        include: [
          {
            model: User,
            attributes: ["id", "username", "email", "role"],
          },
          {
            model: Course,
            attributes: ["id", "courseName"],
          },
        ],
      });

      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Teacher not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Teacher fetched successfully",
        data: teacher,
      });
    } catch (error: any) {
      console.error("Get Single Teacher Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

static async deleteTeacher(req: IAuthRequest, res: Response) {
    try {
      const { id } = req.params;
    const teacherId = Array.isArray(id) ? id[0] : id;


      const teacher = await Teacher.findByPk(teacherId);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Teacher not found",
        });
      }

      // Delete teacher record
      await teacher.destroy();

      // Also delete associated user login
      await User.destroy({ where: { email: teacher.teacherEmail } });

      return res.status(200).json({
        success: true,
        message: "Teacher deleted successfully",
      });
    } catch (error: any) {
      console.error("Delete Teacher Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

export default TeacherController;
