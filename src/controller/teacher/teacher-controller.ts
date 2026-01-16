import { Response } from "express";
import { Teacher, TeacherExpertise } from "../../database/model/teacher-model";
import { IAuthRequest, UserRole } from "../../middleware/auth-middleware";
import bcrypt from 'bcrypt'
import { User } from "../../database/model/user-model";
import { sendTeacherMail } from "../../service/node-mailer";

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
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "something went wrong",
      });
    }
  }
}

export default TeacherController;
