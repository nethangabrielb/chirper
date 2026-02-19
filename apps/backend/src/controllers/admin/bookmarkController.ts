import { Request, Response } from 'express';

import type { BookmarkBody } from '@twitter-clone/shared';

import bookmarkService from '../../services/bookmarkService';
import { GENERIC_ERROR_MESSAGE } from '../../utils/errorMessage';

const bookmarkController = (() => {
  const createBookmark = async (
    req: Request<object, object, BookmarkBody>,
    res: Response
  ) => {
    try {
      const { userId, postId } = req.body;

      if (!userId || !postId) {
        throw new Error('No body payload provided');
      }

      const bookmark = await bookmarkService.create(
        Number(userId),
        Number(postId)
      );

      if (!bookmark) {
        throw new Error('Error creating bookmark');
      }

      res.json({
        status: 'success',
        message: 'Bookmarked successfully',
        data: bookmark,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  return { createBookmark };
})();

export default bookmarkController;
