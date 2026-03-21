import { Request, Response } from 'express';

import jwt, { JwtPayload } from 'jsonwebtoken';
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import UserRepository from '../../repositories/userRepository.js';
import UserService from '../../services/userService.js';
import type { LoginBody, RegistrationBody } from '../../types/auth.js';
import { User } from '../../types/user.js';

const GENERIC_ERROR_MESSAGE = 'An unknown error occurred';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const ROOT_DIR = join(__dirname, '../../../');

const authController = (() => {
  const register = async (
    req: Request<object, object, RegistrationBody>,
    res: Response
  ) => {
    try {
      const newUser = await UserService.createNewUser(req.body);

      res.status(200).json({
        status: 'success',
        message: 'User created successfully!',
        data: newUser,
      });
    } catch (err: unknown) {
      res.status(500).json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const login = async (
    req: Request<object, object, LoginBody>,
    res: Response
  ) => {
    try {
      if (req.query.guest) {
        const guest = {
          id: 999999999,
          name: 'Guest',
          username: 'guest_user',
          avatar:
            'https://bcezmxfxuctgrkiavycl.supabase.co/storage/v1/object/public/images/default-avatar.jpg',
          cover: '/blue.jpg',
          isGuest: true,
          _count: { Followers: 0, Followings: 0, Post: 0 },
        };

        const token = jwt.sign(guest, process.env.JWT_SECRET!);

        res.clearCookie('token', { httpOnly: true });
        res.cookie('token', token, {
          httpOnly: true,
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 14,
          sameSite: 'none',
          secure: true,
        });
        res.status(200).json({
          status: 'success',
          message: 'Log in success!',
        });
      } else {
        const token = await UserService.loginUser(req.body);

        res.clearCookie('token', { httpOnly: true });
        res.cookie('token', token, {
          httpOnly: true,
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 14,
          sameSite: 'none',
          secure: true,
        });
        res.status(200).json({
          status: 'success',
          message: 'Log in success!',
        });
      }
    } catch (err: unknown) {
      res.status(err instanceof Error ? 400 : 500).json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const logout = async (req: Request, res: Response) => {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      });
      res.status(200).json({
        status: 'success',
        message: 'Log out success!',
      });
    } catch (err: unknown) {
      res.status(err instanceof Error ? 400 : 500).json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const redirect = (req: Request, res: Response) => {
    // create a token for the user
    if (req.user) {
      const token = jwt.sign(req.user, process.env.JWT_SECRET!);

      res.setHeader(
        'Set-Cookie',
        `token=${token}; HttpOnly; Secure; SameSite=None; Path=/`
      );

      // session has served its purpose. need to destroy it immediately to prevent storing session in memory
      req.session.destroy(() => {
        res.sendFile(path.join(ROOT_DIR, 'public', 'redirect.html'));
      });
    }
  };

  const validateUserAuthorization = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.json({ authorized: false });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user: User = payload as User;

    if (user.isGuest) {
      return res.json({ authorized: true, isGuest: true });
    }

    const verifyUser = await UserRepository.findById((user as User)?.id);

    if (verifyUser) {
      return res.json({ authorized: true });
    } else {
      return res.json({ authorized: false });
    }
  };

  return { register, login, logout, redirect, validateUserAuthorization };
})();

export default authController;
