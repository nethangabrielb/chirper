import { Request, Response } from 'express';

import notificationService from '../../services/notificationService';
import { User } from '../../types/user';
import { GENERIC_ERROR_MESSAGE } from '../../utils/errorMessage';

const notificationController = (() => {
  const getAll = async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      const notifications = await notificationService.getAll(user.id);

      return res.json({
        status: 'success',
        message: 'Notifications fetched successfully',
        data: notifications,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  return { getAll };
})();

export default notificationController;
