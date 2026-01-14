

import dotenv from "dotenv";
import app from "./src/app";
dotenv.config();





const startServer = async () => {



    const port = process.env.PORT || 9000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  


};

startServer();
