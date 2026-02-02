import { Room } from '@twitter-clone/shared';

import { prisma } from '../prisma/client';

const roomRepository = {
  create: async (data: Room) =>
    await prisma.room.create({
      data: {
        users: {
          connect: data.users.map(user => ({ id: user.id })),
        },
      },
    }),
  findByUserId: async (userId: number) =>
    await prisma.room.findMany({
      include: { users: { where: { id: userId } } },
    }),
};

export default roomRepository;
