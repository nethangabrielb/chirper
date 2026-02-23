import { Router } from 'express';

import bookmarkController from '../../controllers/admin/bookmarkController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const bookmarkRouter = Router();

bookmarkRouter.use(authMiddleware);

bookmarkRouter.post('/', bookmarkController.createBookmark);
bookmarkRouter.delete('/:bookmarkId', bookmarkController.deleteBookmark);

export default bookmarkRouter;
