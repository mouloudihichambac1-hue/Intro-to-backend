import {Router} from 'express';
import { verifyToken }from '../middlewares/auth.middleware.js';
import { getTeacher1 } from '../controllers/Teacher.controller.js';
import {loginTeacher} from '../controllers/Teacher.controller.js';

const teacherRouter=Router();
//define teacher routes 
teacherRouter.route('/loginTeacher').post(loginTeacher);
teacherRouter.route('/getTeacher1').get(verifyToken,getTeacher1);
export  default teacherRouter;