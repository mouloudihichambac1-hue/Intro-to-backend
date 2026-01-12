import {Router} from 'express';

import {loginTeacher} from '../controllers/Teacher.controller.js';

const teacherRouter=Router();
//define teacher routes 
teacherRouter.route('/loginTeacher').post(loginTeacher);

export default teacherRouter;