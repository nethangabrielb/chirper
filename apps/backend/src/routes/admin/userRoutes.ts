import { Router } from 'express';

import multer from 'multer';

import userController from '../../controllers/admin/usersController.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

const upload = multer();

const userRouter = Router();

// check for availability here
userRouter.get('/availability', userController.getAvailability);

userRouter.use(authMiddleware);

userRouter.get('/', userController.getAllUsers);
userRouter.get('/:id', userController.getUser);
userRouter.put(
  '/:id',
  upload.fields([{ name: 'avatar' }, { name: 'cover' }]),
  userController.updateUser
);
userRouter.delete('/:id', userController.deleteUser);

export default userRouter;
