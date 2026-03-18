import { prisma } from '../prisma/client.js';
import { NotificationBody } from '../types/notification.js';

const notificationRepository = {
  create: (data: NotificationBody) =>
    prisma.notification.create({
      data,
      include: {
        sender: {
          select: { id: true, name: true, username: true, avatar: true },
        },
        post: {
          select: { content: true, deleted: true },
        },
      },
    }),
  findAll: (receiverId: number) =>
    prisma.notification.findMany({
      where: { receiverId: receiverId },
      include: {
        sender: {
          select: { id: true, name: true, username: true, avatar: true },
        },
        post: {
          select: { content: true, deleted: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
};

export default notificationRepository;
