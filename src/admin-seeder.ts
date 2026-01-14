import { User } from "./database/model/user-model";
import bcrypt from "bcrypt";
import { UserRole } from "./middleware/auth-middleware"; 

export const adminSeeder = async () => {
  try {
    const existingAdmin = await User.findOne({
      where: { email: "ankitchau2061@gmail.com" },
    });

    if (!existingAdmin) {
      await User.create({
        username: "Ankit Chaudhary",
        email: "ankitchau2061@gmail.com",
        password: bcrypt.hashSync("test123", 12), // hash password
        role: UserRole.ADMIN, // use enum for type safety
      });

      console.log("Admin user created successfully");
    } else {
      console.log(" Admin already exists");
    }
  } catch (error) {
    console.error(" Admin seeder error:", error);
  }
};
