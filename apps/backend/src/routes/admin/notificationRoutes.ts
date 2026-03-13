import { Router } from 'express';

import notificationController from '../../controllers/admin/notificationController';

const notificationRouter = Router();

notificationRouter.get('/', notificationController.getAll);

export default notificationRouter;
