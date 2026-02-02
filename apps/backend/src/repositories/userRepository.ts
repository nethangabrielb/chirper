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
        _count: {
          select: {
            Followers: true,
            Followings: true,
            Post: true,
          },
        },
        rooms: true,
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
              },
              orderBy: {
                Like: {
                  _count: 'desc',
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    }),
  findByUsername: (username: string) =>
    prisma.user.findUnique({ where: { username } }),
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  findAll: () => prisma.user.findMany(),
  updateById: (id: number, data: Partial<RegistrationBody>) =>
    prisma.user.update({ where: { id }, data }),
  deleteById: (id: number) => prisma.user.delete({ where: { id } }),
};

export default UserRepository;
