import{Router} from 'express';
import {loginStudent} from '../controllers/Student.controller.js';


const studentRouter=Router();
//define user routes 

studentRouter.route('/loginStudent').post(loginStudent);

export default studentRouter;
