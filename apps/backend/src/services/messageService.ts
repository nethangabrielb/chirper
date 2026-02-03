import { ChatMessage } from '@twitter-clone/shared';

import messageRepository from '../repositories/messageRepository';

const messageService = {
  createMessage: (message: ChatMessage) => messageRepository.create(message),
  getByRoomId: async (roomId: number) => {
    const messages = await messageRepository.findByRoomId(roomId);
    if (!messages) {
      throw new Error('Error occured fetching messages');
    }
    return messages;
  },
};

export default messageService;
