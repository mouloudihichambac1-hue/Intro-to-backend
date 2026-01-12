import{Router} from 'express';
import { verifyToken }from '../middlewares/auth.middleware.js';
import {registerAdmin,
    loginAdmin,
    getFilieres,
    deleteFiliere,
    registerFiliere,
    updateFiliere,
    deleteAdmin,
    registerStudent,
    registerTeacher,
    updateStudent,updateTeacher,
    deleteStudent,
    deleteTeacher} from '../controllers/Admin.controller.js';
import { getAdmins } from '../models/admin.model.js';
import { getStudent } from '../models/student.model.js';
import { getTeacher } from '../models/teacher.model.js';
const adminRouter=Router();
//define user routes 
//CRUD for Student
adminRouter.route('/deleteStudent/:id').delete(verifyToken,deleteStudent);
adminRouter.route('/updateStudent/:id').patch(verifyToken,updateStudent) ;
adminRouter.route('/registerStudent').post(verifyToken,registerStudent);
adminRouter.route('/getStudents').get(verifyToken,getStudent);
//Crud for Teacher
adminRouter.post('/registerTeacher',verifyToken,registerTeacher);
adminRouter.patch('/updateTeacher/:id',verifyToken,updateTeacher) ;
adminRouter.delete('/deleteTeacher/:id',verifyToken,deleteTeacher);
adminRouter.get('/getTeachers',verifyToken,getTeacher);
//CRUD for Admin
adminRouter.post('/registerAdmin',registerAdmin);
adminRouter.post('/loginAdmin',loginAdmin);
adminRouter.delete('/deleteAdmin/:id',verifyToken,deleteAdmin);
adminRouter.get('/getAdmin',verifyToken,getAdmins);
//CRUD for filier
adminRouter.post('/registerFiliere', verifyToken, registerFiliere);
adminRouter.get('/getFilieres', verifyToken, getFilieres);
adminRouter.patch('/updateFiliere/:id', verifyToken, updateFiliere);
adminRouter.delete('/deleteFiliere/:id', verifyToken, deleteFiliere);
export default adminRouter;