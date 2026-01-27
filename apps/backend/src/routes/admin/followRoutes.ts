import { Router } from 'express';

import followsController from '../../controllers/admin/followsController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const followRouter = Router();

followRouter.use(authMiddleware);

followRouter.get('/followers/:userId', followsController.getFollowers);
followRouter.get('/followings/:userId', followsController.getFollowings);
followRouter.post('/', followsController.createFollow);
followRouter.delete('/:followId', followsController.deleteFollow);

export default followRouter;
