

import dotenv from "dotenv";
import app from "./src/app";
import sequelize from "./src/database/connection";
import { adminSeeder } from "./src/admin-seeder";
dotenv.config();





const startServer = async () => {

try {
   await sequelize.authenticate();
   console.log("Database authenticated successfully!");


    await sequelize.sync({ force: false });
    console.log("DB synced ✔");
 await adminSeeder();
    console.log("Admin seeder finished ✔");

      const port = process.env.PORT || 9000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
} catch (error) {
    
}

  

  


};

startServer();
