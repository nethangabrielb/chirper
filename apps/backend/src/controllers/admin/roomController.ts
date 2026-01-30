import { Request, Response } from 'express';

import { Room } from '@twitter-clone/shared';

import roomService from '../../services/roomService';
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

  return { createRoom };
})();

export default roomController;
