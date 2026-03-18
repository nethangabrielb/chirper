import { ChatMessage } from '@twitter-clone/shared';

import { prisma } from '../prisma/client.js';

const messageRepository = {
  create: async (data: ChatMessage) => await prisma.message.create({ data }),
  findByRoomId: async (roomId: number) =>
    await prisma.message.findMany({
      where: { roomId },
      orderBy: {
        createdAt: 'asc',
      },
    }),
  updateByRoomId: async (roomId: number) =>
    await prisma.message.updateManyAndReturn({
      where: {
        roomId,
      },
      data: {
        unread: false,
      },
    }),
};

export default messageRepository;
