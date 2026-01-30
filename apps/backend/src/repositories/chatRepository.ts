import { ChatMessage } from '@twitter-clone/shared';

import { prisma } from '../prisma/client';

const chatRepository = {
  create: async (data: ChatMessage) => await prisma.message.create({ data }),
};

export default chatRepository;
