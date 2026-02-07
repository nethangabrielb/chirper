import { ChatMessage } from '@twitter-clone/shared';
import { Server, Socket } from 'socket.io';

import { isSocketValid } from '../middlewares/authMiddleware';
import messageService from '../services/messageService';

export const initSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    io.use((socket, next) => {
      if (isSocketValid(socket)) {
        next();
      } else {
        next(new Error('Invalid connection attempt.'));
      }
    });

    socket.on('newMessage', async (data: ChatMessage, callback) => {
      const message = await messageService.createMessage(data);
      if (message) {
        callback({
          success: 'ok',
          message,
        });
      }
      socket.to(String(message.roomId)).emit('newMessage', message);
    });

    socket.on('joinRoom', (roomId: string) => {
      socket.join(roomId);
    });
  });
};
