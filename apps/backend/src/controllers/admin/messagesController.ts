import { Request, Response } from 'express';

import messageService from '../../services/messageService.js';
import { User } from '../../types/user.js';
import { GENERIC_ERROR_MESSAGE } from '../../utils/errorMessage.js';

const messageController = (() => {
  const getMessages = async (
    req: Request<{ roomId: number }, object, object>,
    res: Response
  ) => {
    try {
      const user = req.user as User;

      if (user.isGuest) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Unauthorized access.',
        });
      }

      const messages = await messageService.getByRoomId(
        Number(req.params.roomId)
      );

      res.json({
        status: 'success',
        data: messages,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const patchMessages = async (
    req: Request<{ roomId: number }, object, object>,
    res: Response
  ) => {
    try {
      const messages = await messageService.patchMessagesUnreadStatus(
        Number(req.params.roomId)
      );

      res.json({
        status: 'success',
        data: messages,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  return { getMessages, patchMessages };
})();

export default messageController;
