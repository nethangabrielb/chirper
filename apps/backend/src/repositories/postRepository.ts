import { prisma } from '../prisma/client';
import { Post } from '../types/post';

const postRepository = {
  create: (data: Post) => prisma.post.create({ data }),
  findById: (id: number) =>
    prisma.post.findUnique({
      where: { id },
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
          where: {
            deleted: false,
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
            bookmarks: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        bookmarks: true,
      },
    }),
  findAll: () =>
    prisma.post.findMany({
      where: {
        deleted: false,
        replyId: null,
      },
      orderBy: {
        createdAt: 'desc',
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
          where: {
            deleted: false,
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
    }),
  findRepliesByUserId: (id: number) =>
    prisma.post.findMany({
      where: {
        replyId: {
          not: null,
        },
        userId: id,
        deleted: false,
      },
      orderBy: {
        createdAt: 'desc',
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
            bookmarks: true,
          },
          orderBy: {
            Like: {
              _count: 'desc',
            },
          },
        },
        reply: {
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
            bookmarks: true,
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
                bookmarks: true,
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
              },
              orderBy: {
                Like: {
                  _count: 'desc',
                },
              },
            },
          },
        },
        bookmarks: true,
      },
    }),
  findLikedPostsByUserId: (id: number) =>
    prisma.post.findMany({
      where: {
        Like: {
          some: {
            userId: id,
          },
        },
        deleted: false,
      },
      orderBy: {
        createdAt: 'desc',
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
            bookmarks: true,
          },
          orderBy: {
            Like: {
              _count: 'desc',
            },
          },
        },
        reply: {
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
            bookmarks: true,
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
                bookmarks: true,
              },
              orderBy: {
                Like: {
                  _count: 'desc',
                },
              },
            },
          },
        },
        bookmarks: true,
      },
    }),
  findByBookmarked: (userId: number) =>
    prisma.bookmark.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        post: {
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
                bookmarks: true,
              },
              orderBy: {
                Like: {
                  _count: 'desc',
                },
              },
            },
            reply: {
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
                bookmarks: true,
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
                    bookmarks: true,
                  },
                  orderBy: {
                    Like: {
                      _count: 'desc',
                    },
                  },
                },
              },
            },
            bookmarks: true,
          },
        },
      },
    }),
  deleteById: (id: number) =>
    prisma.post.update({ where: { id }, data: { deleted: true } }),
};

export default postRepository;
