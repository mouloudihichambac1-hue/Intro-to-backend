import express from 'express';


const app =express();//create expres app
app.use(express.json());//middleware to parse json request body
import {studentRouter,teacherRouter} from './routers/user.route.js';
app.use("/api/v1/students",studentRouter);
app.use("/api/v1/teachers",teacherRouter);
//router:http://localhost:4000/api/v1/students/loginStudent
//router:http://localhost:4000/api/v1/teachers/loginTeacher
// router:http://localhost:4000/api/v1/students/registerStudent
// router:http://localhost:4000/api/v1/teachers/registerTeacher

export default app;