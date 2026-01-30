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
};

export default roomRepository;
