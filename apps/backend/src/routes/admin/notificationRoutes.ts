import { Router } from 'express';

import notificationController from '../../controllers/admin/notificationController.js';

const notificationRouter = Router();

notificationRouter.get('/', notificationController.getAll);

export default notificationRouter;
