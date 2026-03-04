import { ChatMessage } from '@twitter-clone/shared';
import { Server, Socket } from 'socket.io';

import { isSocketValid } from '../middlewares/authMiddleware';
import notificationRepository from '../repositories/notificationRepository';
import messageService from '../services/messageService';
import roomService from '../services/roomService';
import { User } from '../types/user';
import { validateEventSender } from '../utils/validateEventSender';

export const initSocket = (io: Server) => {
  io.use((socket, next) => {
    if (isSocketValid(socket)) {
      next();
    } else {
      next(new Error('Invalid connection attempt.'));
    }
  });

  io.on('connection', (socket: Socket) => {
    socket.on(
      'newMessage',
      async (data: ChatMessage, senderId: number, callback) => {
        if (validateEventSender(senderId, socket.data.userId)) {
          const message = await messageService.createMessage(data);
          if (message) {
            callback({
              success: true,
              message,
            });
          }

          socket.to(String(message.roomId)).emit('newMessage', message);
        } else {
          console.log('Invalid socket event.');
        }
      }
    );

    socket.on(
      'joinRoom',
      async (roomId: string, senderId: number, callback) => {
        if (validateEventSender(senderId, socket.data.userId)) {
          // Check if this user is among the users associated in the room
          const rooms = await roomService.getUserRooms(senderId);
          if (rooms) {
            const roomToJoin = rooms.find(
              room =>
                room.id === Number(roomId) &&
                room.users.some(user => user.id === senderId)
            );
            if (roomToJoin) {
              socket.join(roomId);
              callback({ status: 'ok' });
            } else {
              console.log('User is not a part of the room.');
            }
          }
        }
      }
    );

    socket.on(
      'leaveRoom',
      async (roomId: string, senderId: number, callback) => {
        if (validateEventSender(senderId, socket.data.userId)) {
          // Check if this user is among the users associated in the room
          const rooms = await roomService.getUserRooms(senderId);
          if (rooms) {
            const roomToJoin = rooms.find(
              room =>
                room.id === Number(roomId) &&
                room.users.some(user => user.id === senderId)
            );
            if (roomToJoin) {
              socket.leave(roomId);
              callback({ status: 'ok' });
            } else {
              console.log('User is not a part of the room.');
            }
          }
        }
      }
    );

    socket.on(
      'notification',
      async (
        user: User,
        receiverId: number,
        type: 'reply' | 'like' | 'follow'
      ) => {
        if (validateEventSender(user.id, socket.data.userId)) {
          let content: string = '';
          if (type === 'reply') {
            content = `${user.name} (@${user.username}) replied to your post`;
          } else if (type === 'like') {
            content = `${user.name} (@${user.username}) liked your post`;
          } else if (type === 'follow') {
            content = `${user.name} (@${user.username}) followed you`;
          }

          const notification = await notificationRepository.create({
            receiverId,
            content,
          });

          console.log(notification);

          if (notification) {
            socket.broadcast.emit('notification', receiverId, notification);
          }
        }
      }
    );
  });
};
