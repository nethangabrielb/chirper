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
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as
      | User
      | { guestId: string; isGuest: boolean };

    req.user = payload; // attach user info to request
    next();
  } catch {
    res
      .status(403)
      .json({ status: 'error', message: 'Invalid or expired token' });
  }
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
