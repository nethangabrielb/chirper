import { prisma } from '../prisma/client';
import type { RegistrationBody } from '../types/auth';

/*
  In this case, because of how the schema is designed:

  Followers = quantity of follow records where the user is following someone (i.e, qty where the user is a follower)
  Followings = quantity of follow records where others have the user in their following 
  (i.e, qty where the user is in other's following)

  I know it sounds confusing but if you look at the schema, it should make sense
*/

const UserRepository = {
  createNewUser: (data: RegistrationBody) => prisma.user.create({ data }),
  findById: (id: number) =>
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        createdAt: true,
        avatar: true,
        email: true,
        cover: true,
        _count: {
          select: {
            Followers: true,
            Followings: true,
            Post: true,
          },
        },
        rooms: {
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
              },
            },
          },
        },
        Post: {
          where: {
            deleted: false,
            replyId: null,
          },
          include: {
            _count: {
              select: {
                Like: true,
                replies: {
                  where: {
                    deleted: false,
                  },
                },
              },
            },
            user: {
              select: {
                avatar: true,
                username: true,
                name: true,
                id: true,
                createdAt: true,
                _count: {
                  select: {
                    Followers: true,
                    Followings: true,
                    Post: true,
                  },
                },
              },
            },
            Like: {
              select: {
                userId: true,
              },
            },
            replies: {
              include: {
                _count: {
                  select: {
                    Like: true,
                    replies: {
                      where: {
                        deleted: false,
                      },
                    },
                  },
                },
                user: {
                  select: {
                    avatar: true,
                    username: true,
                    name: true,
                  },
                },
                Like: {
                  select: {
                    userId: true,
                  },
                },
                bookmarks: true,
              },
              orderBy: {
                Like: {
                  _count: 'desc',
                },
              },
            },
            bookmarks: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    }),
  findByUsername: (username: string, id?: number) =>
    id
      ? prisma.user.findUnique({ where: { username, NOT: { id } } })
      : prisma.user.findUnique({ where: { username } }),
  findByName: (name: string) =>
    prisma.user.findMany({
      where: {
        OR: [{ username: { contains: name } }, { name: { contains: name } }],
      },
    }),
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  findAll: () =>
    prisma.user.findMany({
      select: { id: true, username: true, avatar: true, name: true },
    }),
  updateById: (id: number, data: Partial<RegistrationBody>) =>
    prisma.user.update({ where: { id }, data }),
  deleteById: (id: number) => prisma.user.delete({ where: { id } }),
  findUsersChatList: (userId: number, followingIds: number[]) =>
    prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: userId,
            },
          },
          {
            id: {
              not: {
                in: followingIds,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
      },
      take: 10,
    }),
  findFollowingList: (id: number, pageParam: number) =>
    prisma.user.findMany({
      where: {
        AND: [
          { id: { not: id } },
          { Followings: { every: { followerId: { not: id } } } },
        ],
      },
      orderBy: [{ Followings: { _count: 'desc' } }, { id: 'asc' }],
      select: {
        Followings: true,
        id: true,
        name: true,
        username: true,
        avatar: true,
        _count: {
          select: {
            Followings: true,
          },
        },
      },
      skip: pageParam * 20,
      take: 20,
    }),
  findFollowingListLimit: (id: number, limit: number) =>
    prisma.user.findMany({
      where: {
        id: { not: id },
        Followings: { every: { followerId: { not: id } } },
      },
      orderBy: [{ Followings: { _count: 'desc' } }],

      select: {
        Followers: true,
        id: true,
        name: true,
        username: true,
        avatar: true,
        _count: {
          select: {
            Followings: true,
          },
        },
      },
      take: limit,
    }),
};

export default UserRepository;
