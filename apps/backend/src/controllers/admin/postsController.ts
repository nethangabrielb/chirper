import { Request, Response } from 'express';

import postService from '../../services/postService';
import { Post } from '../../types/post';
import { User } from '../../types/user';
import { GENERIC_ERROR_MESSAGE } from '../../utils/errorMessage';

const postsController = (() => {
  const createPost = async (
    req: Request<object, object, Post>,
    res: Response
  ) => {
    try {
      const newPost = await postService.createPost(req.body);

      res.json({
        status: 'success',
        message: 'Post created successfully!',
        data: newPost,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const getPost = async (req: Request<{ postId: string }>, res: Response) => {
    try {
      const post = await postService.getPost(Number(req.params.postId));

      res.json({
        status: 'success',
        message: 'Post fetched success',
        data: post,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const getPosts = async (req: Request, res: Response) => {
    try {
      if (req.query.bookmarks) {
        const user = req.user as User;
        const posts = await postService.getBookmarkedPosts(user.id);

        res.json({
          status: 'success',
          message: 'Bookmarked posts fetched success',
          data: posts,
        });
      } else {
        const posts = await postService.getPosts(req.user as User);

        res.json({
          status: 'success',
          message: 'Posts fetched success',
          data: posts,
        });
      }
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const deletePost = async (
    req: Request<{ postId: string }>,
    res: Response
  ) => {
    try {
      await postService.deletePost(Number(req.params.postId));

      res.json({
        status: 'success',
        message: 'Post deleted successfully!',
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const getUserReplies = async (
    req: Request<{ userId: string }>,
    res: Response
  ) => {
    try {
      const replies = await postService.getUserReplies(
        Number(req.params.userId)
      );

      res.json({
        status: 'success',
        message: 'Replies fetched successfully!',
        data: replies,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const getUserLiked = async (
    req: Request<{ userId: string }>,
    res: Response
  ) => {
    try {
      const likedPosts = await postService.getUserLiked(
        Number(req.params.userId)
      );

      res.json({
        status: 'success',
        message: 'Liked posts fetched successfully!',
        data: likedPosts,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  return {
    createPost,
    getPost,
    getPosts,
    deletePost,
    getUserReplies,
    getUserLiked,
  };
})();

export default postsController;
