import{Router} from 'express';
import {registerStudent} from '../controllers/Student.controller.js';
import {registerTeacher} from '../controllers/Teacher.controller.js';
import {loginTeacher} from '../controllers/Teacher.controller.js';
import {loginStudent} from '../controllers/Student.controller.js';

const studentRouter=Router();
//define user routes here
studentRouter.route('/registerStudent').post(registerStudent);
studentRouter.route('/loginStudent').post(loginStudent);
const teacherRouter=Router();
teacherRouter.route('/registerTeacher').post(registerTeacher);
teacherRouter.route('/loginTeacher').post(loginTeacher);
export {studentRouter,teacherRouter};
