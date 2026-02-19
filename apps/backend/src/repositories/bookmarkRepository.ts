import { prisma } from '../prisma/client';

const bookmarkRepository = {
  create: (userId: number, postId: number) =>
    prisma.bookmark.create({ data: { userId, postId } }),
};

export default bookmarkRepository;
