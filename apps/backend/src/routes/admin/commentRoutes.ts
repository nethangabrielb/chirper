import { Router } from 'express';

import multer from 'multer';

import commentsController from '../../controllers/admin/commentsController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const upload = multer();
const commentRouter = Router();

commentRouter.use(authMiddleware);

commentRouter.get('/:commentId', commentsController.getComment);
commentRouter.post(
  '/',
  upload.single('imageUrl'),
  commentsController.createComment
);
commentRouter.delete('/:commentId', commentsController.deleteComment);

export default commentRouter;
