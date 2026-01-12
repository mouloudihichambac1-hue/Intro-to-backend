import { Router } from 'express';
import { verifyToken }from '../middlewares/auth.middleware.js';
import { startSession, markPresence, closeSession,getSessionStatus } from '../controllers/Session.controller.js';


const sessionRouter = Router();

sessionRouter.post('/start',verifyToken, startSession); // Pour le prof
sessionRouter.post('/mark-presence',verifyToken, markPresence); // Pour l'élève
sessionRouter.patch('/close/:sessionId',verifyToken, closeSession); // Pour le prof
// Route pour que le prof suive les présences en direct
sessionRouter.get('/status/:sessionId', verifyToken, getSessionStatus);
export default sessionRouter;