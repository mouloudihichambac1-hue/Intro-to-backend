import { Router } from 'express';
import {deleteAdmin} from '../controllers/superUser.controller.js';


const superUserRouter = Router();
superUserRouter.delete('/deleteAdmin/:id',deleteAdmin);
export default superUserRouter;