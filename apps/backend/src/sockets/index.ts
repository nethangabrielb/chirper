import { ChatMessage } from '@twitter-clone/shared';
import { Server, Socket } from 'socket.io';

import { isSocketValid } from '../middlewares/authMiddleware.js';
import notificationRepository from '../repositories/notificationRepository.js';
import messageService from '../services/messageService.js';
import roomService from '../services/roomService.js';
import { User } from '../types/user.js';
import { validateEventSender } from '../utils/validateEventSender.js';

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
          
          socket.broadcast.emit('newMessageNotification', message.receiverId);
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
                room.users.some(user => user?.id === senderId)
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
                room.users.some(user => user?.id === senderId)
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
        type: 'reply' | 'like' | 'follow',
        postId?: number,
        postContent?: string
      ) => {
        if (validateEventSender(user?.id, socket.data.userId)) {
          let content: string = '';
          if (type === 'reply') {
            content = `${user.name} (@${user.username}) replied to your post`;
          } else if (type === 'like') {
            content = `${user.name} (@${user.username}) liked your post`;
          } else if (type === 'follow') {
            content = `${user.name} (@${user.username}) followed you`;
          }

          const notification = await notificationRepository.create({
            senderId: user?.id,
            receiverId: receiverId,
            content,
            postId: postId ?? undefined,
            replyContent: postContent ?? undefined,
          });

          if (notification) {
            socket.broadcast.emit('notification', receiverId, notification);
          }
        }
      }
    );
  });
};
