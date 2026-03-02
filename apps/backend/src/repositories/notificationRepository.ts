import { prisma } from '../prisma/client';
import { NotificationBody } from '../types/notification';

const notificationRepository = {
  create: (data: NotificationBody) => prisma.notification.create({ data }),
  findAll: (receiverId: number) =>
    prisma.notification.findMany({ where: { receiverId: receiverId } }),
};

export default notificationRepository;
