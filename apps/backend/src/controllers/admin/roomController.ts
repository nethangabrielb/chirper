import { Request, Response } from 'express';

import { Room } from '@twitter-clone/shared';

import roomService from '../../services/roomService';
import { User } from '../../types/user';
import { GENERIC_ERROR_MESSAGE } from '../../utils/errorMessage';

const roomController = (() => {
  const createRoom = async (
    req: Request<object, object, Room>,
    res: Response
  ) => {
    try {
      const room = await roomService.createRoom(req.body);

      res.json({
        status: 'success',
        message: 'Room created successfully!',
        data: room,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const getUserRooms = async (
    req: Request<{ userId: string }, object, object>,
    res: Response
  ) => {
    try {
      const authenticatedUser = req.user as User;

      if (!authenticatedUser) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized',
        });
      }

      if (authenticatedUser.id !== Number(req.params.userId)) {
        return res.status(403).json({
          status: 'error',
          message: 'Forbidden',
        });
      }

      const rooms = await roomService.getUserRooms(Number(req.params.userId));

      res.json({
        status: 'success',
        message: 'User chat rooms fetched successfully!',
        data: rooms,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  return { createRoom, getUserRooms };
})();

export default roomController;
