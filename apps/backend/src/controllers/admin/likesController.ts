import { Request, Response } from 'express';

import { postLikeService } from '../../services/likeService.js';
import { User } from '../../types/user.js';
import { GENERIC_ERROR_MESSAGE } from '../../utils/errorMessage.js';

const postLikesController = (() => {
  const createLike = async (
    req: Request<{ postId: number }, object, object>,
    res: Response
  ) => {
    try {
      const like = await postLikeService.createLike(
        Number(req.params.postId),
        req.user as User
      );

      res.json({
        status: 'success',
        message: 'Post liked successfully',
        data: like,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const deleteLike = async (
    req: Request<{ postId: number }, object, object>,
    res: Response
  ) => {
    try {
      await postLikeService.deleteLike(
        Number(req.params.postId),
        req.user as User
      );

      res.json({
        status: 'success',
        message: 'Unlike success',
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  return { createLike, deleteLike };
})();

export { postLikesController };
