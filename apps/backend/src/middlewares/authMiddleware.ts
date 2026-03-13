import { NextFunction, Request, Response } from 'express';

import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

import type { User } from '../types/user';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  const token = cookies.token; // Bearer TOKEN

  if (!token)
    return res
      .status(401)
      .json({ status: 'error', message: 'No token provided' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as User;

    req.user = payload; // attach user info to request
    next();
  } catch {
    res
      .status(403)
      .json({ status: 'error', message: 'Invalid or expired token' });
  }
};

export const guestAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as User;

  const writeMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  console.log(writeMethods);
  console.log(user);

  // Define public auth routes that MUST allow POST
  const authExceptions = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/logout',
  ];

  if (authExceptions.includes(req.path)) {
    return next();
  }

  if (user?.isGuest && writeMethods.includes(req.method)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Guest accounts are read-only.',
    });
  }

  next();
};

export const isSocketValid = (socket: Socket): boolean => {
  const cookies = cookie.parseCookie(socket.handshake.headers.cookie ?? '');
  const token = cookies.token as string;

  const isValid = jwt.verify(token, process.env.JWT_SECRET!) as User;

  if (isValid) {
    socket.data.userId = isValid.id;
    return true;
  } else {
    return false;
  }
};
