import dotenv from "dotenv";
import { Dialect } from "sequelize";
dotenv.config();

import { Sequelize } from "sequelize-typescript";
import { User } from "./model/user-model";
import { Teacher } from "./model/teacher-model";
import Category from "./model/category-model";
import Course from "./model/course-model";

const dialect: Dialect = (process.env.DB_DIALECT as Dialect) || "mysql";

const sequelize = new Sequelize({
  database: process.env.DB_NAME || "studentmanagement",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  dialect,
  models: [User, Teacher,Category,Course],
});

// Associations
User.hasMany(Teacher, { foreignKey: "userId" });
Teacher.belongsTo(User, { foreignKey: "userId" });
Course.hasMany(Teacher, { foreignKey: "courseId" });
Teacher.belongsTo(Course, { foreignKey: "courseId" });
Category.hasMany(Course, { foreignKey: "categoryId" });
Course.belongsTo(Category, { foreignKey: "categoryId"});
User.hasMany(Course, { foreignKey: "userId" });
Course.belongsTo(User, { foreignKey: "userId" });

export default sequelize;
