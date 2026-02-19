import { prisma } from '../prisma/client';

const bookmarkRepository = {
  create: (userId: number, postId: number) =>
    prisma.bookmark.create({ data: { userId, postId } }),
  delete: (bookmarkId: number) =>
    prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    }),
};

export default bookmarkRepository;
