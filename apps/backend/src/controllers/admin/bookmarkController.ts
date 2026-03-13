import { Request, Response } from 'express';

import type { BookmarkBody } from '@twitter-clone/shared';

import bookmarkService from '../../services/bookmarkService';
import { User } from '../../types/user';
import { GENERIC_ERROR_MESSAGE } from '../../utils/errorMessage';

const bookmarkController = (() => {
  const createBookmark = async (
    req: Request<object, object, BookmarkBody>,
    res: Response
  ) => {
    try {
      const user = req.user as User;
      const { userId, postId } = req.body;

      if (!userId || !postId) {
        throw new Error('No body payload provided');
      }

      if (userId !== user?.id) {
        throw new Error('Unauthorized action');
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

  const deleteBookmark = async (
    req: Request<{ bookmarkId: string }, object, object>,
    res: Response
  ) => {
    try {
      const { bookmarkId } = req.params;
      const user = req.user as User;
      if (!bookmarkId) {
        throw new Error('Invalid Bookmark ID');
      }

      const bookmark = await bookmarkService.findById(Number(bookmarkId));

      if (bookmark.userId !== user?.id) {
        return res.json({
          status: 'error',
          message: 'You are unauthorized to perform this action',
        });
      }

      const deletedBookmark = await bookmarkService.delete(Number(bookmarkId));

      if (!deletedBookmark) {
        throw new Error('There was an issue undoing a bookmark');
      }

      res.json({
        status: 'success',
        message: 'Bookmark removed successfully',
        data: deletedBookmark,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  return { createBookmark, deleteBookmark };
})();

export default bookmarkController;
