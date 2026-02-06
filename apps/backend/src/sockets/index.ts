import { ChatMessage } from '@twitter-clone/shared';
import { Server, Socket } from 'socket.io';

import messageService from '../services/messageService';

export const initSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
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
