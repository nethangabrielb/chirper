import { prisma } from '../prisma/client';
import { PostLike } from '../types/like';

const postLikeRepository = {
  create: (data: PostLike) => prisma.postLike.create({ data }),
  deleteByIds: (data: PostLike) =>
    prisma.postLike.delete({
      where: {
        userId_postId: {
          userId: data.userId,
          postId: data.postId,
        },
      },
    }),
};

export { postLikeRepository };
