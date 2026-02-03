import { ChatMessage } from '@twitter-clone/shared';

import { prisma } from '../prisma/client';

const messageRepository = {
  create: async (data: ChatMessage) => await prisma.message.create({ data }),
  findByRoomId: async (roomId: number) =>
    await prisma.message.findMany({ where: { roomId } }),
};

export default messageRepository;
