import { Router } from 'express';

import messageController from '../../controllers/admin/messagesController';

const messageRouter = Router();

messageRouter.get('/:roomId', messageController.getMessages);
messageRouter.patch('/:roomId', messageController.patchMessages);

export default messageRouter;
