import { ChatMessage } from '@twitter-clone/shared';
import { Server, Socket } from 'socket.io';

import { isSocketValid } from '../middlewares/authMiddleware';
import messageService from '../services/messageService';
import roomService from '../services/roomService';
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

    socket.on('joinRoom', async (roomId: string, senderId: number) => {
      if (validateEventSender(senderId, socket.data.userId)) {
        // Check if this user is among the users associated in the room
        const rooms = await roomService.getUserRooms(senderId);
        if (rooms) {
          const roomToJoin = rooms.find(room => room.id === Number(roomId));
          if (roomToJoin) {
            socket.join(roomId);
          } else {
            console.log('User is not a part of the room.');
          }
        }
      }
    });

    socket.on('leaveRoom', async (roomId: string, senderId: number) => {
      if (validateEventSender(senderId, socket.data.userId)) {
        // Check if this user is among the users associated in the room
        const rooms = await roomService.getUserRooms(senderId);
        if (rooms) {
          const roomToJoin = rooms.find(room => room.id === Number(roomId));
          if (roomToJoin) {
            socket.leave(roomId);
          } else {
            console.log('User is not a part of the room.');
          }
        }
      }
    });
  });
};
