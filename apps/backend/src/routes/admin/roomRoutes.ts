import { Router } from 'express';

import roomController from '../../controllers/admin/roomController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const roomRouter = Router();

roomRouter.use(authMiddleware);

roomRouter.post('/', roomController.createRoom);
roomRouter.get('/users/:userId', roomController.getUserRooms);

export default roomRouter;
