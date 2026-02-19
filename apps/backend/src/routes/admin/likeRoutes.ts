import { Router } from 'express';

import { postLikesController } from '../../controllers/admin/likesController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const likesRouter = Router();

likesRouter.use(authMiddleware);

likesRouter.post('/posts/:postId', postLikesController.createLike);
likesRouter.delete('/posts/:postId', postLikesController.deleteLike);

export default likesRouter;
