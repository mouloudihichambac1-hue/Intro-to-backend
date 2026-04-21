import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit'; 

const app = express();

app.use(helmet()); 
app.disable('x-powered-by');

//  Configuration CORS restrictive
const allowedOrigin = process.env.FRONTEND_URL;
app.use(cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

//  Protection contre les abus
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100 
});
app.use("/api/v1/", limiter);
app.use(express.json());//middleware to parse json request body

import superUserRouter from './routers/SuperUser.route.js';
import sessionRouter from './routers/Session.route.js';
import studentRouter from './routers/Student.route.js';
import teacherRouter from './routers/Teacher.route.js';
import adminRouter from './routers/Admin.route.js';

app.use("/api/v1/admins",adminRouter);
app.use("/api/v1/students",studentRouter);
app.use("/api/v1/teachers",teacherRouter);
app.use("/api/v1/sessions",sessionRouter);
app.use("/api/v1/superUser",superUserRouter);
/* student routes :http://localhost:4000/api/v1/students/loginStudent

Teacher routes :http://localhost:4000/api/v1/teachers/loginTeacher


Administration router:
http://localhost:4000/api/v1/admins/registerAdmin
http://localhost:4000/api/v1/admins/loginAdmin
http://localhost:4000/api/v1/admins/getAdmin
http://localhost:4000/api/v1/admins/deleteAdmin/:id

http://localhost:4000/api/v1/admins/registerStudent
http://localhost:4000/api/v1/admins/registerTeacher
http://localhost:4000/api/v1/admins/getTeachers
http://localhost:4000/api/v1/admins/getStudents
http://localhost:4000/api/v1/admins/updateStudent/:id
http://localhost:4000/api/v1/admins/updateTeacher/:id
http://localhost:4000/api/v1/admins/deleteStudent/:id
http://localhost:4000/api/v1/admins/deleteTeacher/:id
*/
/* Session routers :
http://localhost:4000/api/v1/sessions/start
http://localhost:4000/api/v1/sessions/mark-presence
http://localhost:4000/api/v1/sessions/close/:sessionid
http://localhost:4000/api/v1/sessions/start
*/
/*SupperUser (owner of site):
http://localhost:4000/api/v1/superUser/deleteAdmin/:id */


export default app;