import { Router } from 'express';

import messageController from '../../controllers/admin/messagesController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const messageRouter = Router();

messageRouter.use(authMiddleware);

messageRouter.get('/:roomId', messageController.getMessages);
messageRouter.patch('/:roomId', messageController.patchMessages);

export default messageRouter;
