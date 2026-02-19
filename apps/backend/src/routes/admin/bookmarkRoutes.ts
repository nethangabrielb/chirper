import { Router } from 'express';

import bookmarkController from '../../controllers/admin/bookmarkController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const bookmarkRouter = Router();

bookmarkRouter.use(authMiddleware);

bookmarkRouter.post('/', bookmarkController.createBookmark);

export default bookmarkRouter;
