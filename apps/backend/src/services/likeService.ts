import { postLikeRepository } from '../repositories/likeRepository.js';
import { User } from '../types/user.js';

const postLikeService = {
  createLike: async (postId: number, user: User) => {
    const like = await postLikeRepository.create({ postId, userId: user?.id });
    if (!like) throw new Error('There was an issue liking post.');
    return like;
  },
  deleteLike: async (postId: number, user: User) => {
    return postLikeRepository.deleteByIds({ postId, userId: user?.id });
  },
};

export { postLikeService };
