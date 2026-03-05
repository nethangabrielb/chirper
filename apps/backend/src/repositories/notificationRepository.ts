import { prisma } from '../prisma/client';
import { NotificationBody } from '../types/notification';

const notificationRepository = {
  create: (data: NotificationBody) => prisma.notification.create({ data }),
  findAll: (receiverId: number) =>
    prisma.notification.findMany({
      where: { receiverId: receiverId },
      include: {
        sender: {
          select: { id: true, name: true, username: true, avatar: true },
        },
        post: {
          select: { content: true },
        },
      },
    }),
};

export default notificationRepository;
