import{Router} from 'express';
import {loginStudent,getStudent1} from '../controllers/Student.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const studentRouter=Router();
//define user routes 

studentRouter.route('/loginStudent').post(loginStudent);
studentRouter.get('/getStudent1',verifyToken,getStudent1);
export default studentRouter;
