import express from "express";
import authRoutes from "./routes/auth-routes";
import teacherRoutes from './routes/teacher-routes'
import courseRoutes from './routes/course-routes'
import categoryRoutes from './routes/category-route'



const app = express();
app.use(express.json());

app.use("/api", authRoutes);
app.use('api/admin', teacherRoutes)
app.use('api/admin', courseRoutes)
app.use('api/admin', categoryRoutes)




export default app
