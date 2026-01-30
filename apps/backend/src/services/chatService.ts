import { ChatMessage } from '@twitter-clone/shared';

import chatRepository from '../repositories/chatRepository';

const chatService = {
  createChat: (message: ChatMessage) => chatRepository.create(message),
};

export default chatService;
