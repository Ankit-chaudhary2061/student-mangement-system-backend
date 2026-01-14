import dotenv from "dotenv";
import { Dialect } from "sequelize";
dotenv.config();

import { Sequelize } from "sequelize-typescript";
import { User } from "./model/user-model";

const dialect: Dialect = (process.env.DB_DIALECT as Dialect) || "mysql";



const sequelize = new Sequelize({
 database: process.env.DB_NAME || "studentmanagement",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  dialect,
  models:[User]

})






export default sequelize
