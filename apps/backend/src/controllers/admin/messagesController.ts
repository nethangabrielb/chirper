import { Request, Response } from 'express';

import messageService from '../../services/messageService';
import { GENERIC_ERROR_MESSAGE } from '../../utils/errorMessage';

const messageController = (() => {
  const getMessages = async (
    req: Request<{ roomId: number }, object, object>,
    res: Response
  ) => {
    try {
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

  return { getMessages };
})();

export default messageController;
