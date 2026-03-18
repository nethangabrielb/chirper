import { Router } from 'express';

import passport from 'passport';

import authController from '../../controllers/guest/authController.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import { validateRegistration } from '../../validators/user/register.js';

const authRouter = Router();

authRouter.post('/register', validateRegistration, authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/logout', authMiddleware, authController.logout);

authRouter.get('/login/google', passport.authenticate('google'));
authRouter.get(
  '/oauth2/redirect/google',
  passport.authenticate('google', {
    failureRedirect: '/',
    failureMessage: true,
  }),
  authController.redirect
);
authRouter.get('/user', authController.validateUserAuthorization);

export default authRouter;
