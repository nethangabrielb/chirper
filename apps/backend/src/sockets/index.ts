import { ChatMessage } from '@twitter-clone/shared';
import { Server, Socket } from 'socket.io';

import { isSocketValid } from '../middlewares/authMiddleware';
import messageService from '../services/messageService';
import { validateEventSender } from '../utils/validateEventSender';

export const initSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    io.use((socket, next) => {
      if (isSocketValid(socket)) {
        next();
      } else {
        next(new Error('Invalid connection attempt.'));
      }
    });

    socket.on(
      'newMessage',
      async (data: ChatMessage, senderId: number, callback) => {
        if (validateEventSender(senderId, socket.data.userId)) {
          console.log('Valid!');
          const message = await messageService.createMessage(data);

          if (message) {
            callback({
              success: 'ok',
              message,
            });
          }
          socket.to(String(message.roomId)).emit('newMessage', message);
        } else {
          console.log('Invalid socket event.');
        }
      }
    );

    socket.on('joinRoom', (roomId: string) => {
      socket.join(roomId);
    });

    socket.on('leaveRoom', (roomId: string) => {
      socket.leave(roomId);
    });
  });
};
