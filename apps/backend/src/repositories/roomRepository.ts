import { Room } from '@twitter-clone/shared';

import { prisma } from '../prisma/client.js';
import { User } from '../types/user.js';

const roomRepository = {
  create: async (data: Room) =>
    await prisma.room.create({
      data: {
        users: {
          connect: data.users.map(user => ({ id: user?.id })),
        },
      },
    }),
  findByUserId: async (userId: number) =>
    await prisma.room.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        messages: {
          select: {
            id: true,
            unread: true,
            senderId: true,
          },
        },
      },
    }),
  findByUsers: async (users: User[]) =>
    await prisma.room.findFirst({
      where: {
        AND: [
          { users: { every: { id: { in: users.map(user => user?.id) } } } },
          ...users.map(user => ({
            users: { some: { id: user?.id } },
          })),
        ],
      },
      include: {
        messages: {
          select: {
            id: true,
            unread: true,
            senderId: true,
          },
        },
      },
    }),
};

export default roomRepository;
