import { Router } from 'express';

import notificationController from '../../controllers/admin/notificationController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const notificationRouter = Router();

notificationRouter.use(authMiddleware);

notificationRouter.get('/', notificationController.getAll);

export default notificationRouter;
