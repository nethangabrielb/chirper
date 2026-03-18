import { faker } from '@faker-js/faker';

import { prisma } from '../prisma/client.js';

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Fetch existing users ───────────────────────────────────────────────────
  const users = await prisma.user.findMany();
  if (users.length < 2) {
    throw new Error('Need at least 2 users. Run your user seeder first.');
  }
  const userIds = users.map(u => u.id);

  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const pickMany = <T>(arr: T[], min = 1, max = 5): T[] => {
    const count = faker.number.int({ min, max: Math.min(max, arr.length) });
    return faker.helpers.arrayElements(arr, count);
  };

  // ─── Follows ────────────────────────────────────────────────────────────────
  console.log('  → Follows');
  const followPairs = new Set<string>();
  for (const followerId of userIds) {
    const targets = pickMany(
      userIds.filter(id => id !== followerId),
      1,
      Math.min(6, userIds.length - 1)
    );
    for (const followingId of targets) {
      followPairs.add(`${followerId}-${followingId}`);
    }
  }

  await prisma.follow.createMany({
    data: Array.from(followPairs).map(pair => {
      const [followerId, followingId] = pair.split('-').map(Number);
      return { followerId, followingId };
    }),
    skipDuplicates: true,
  });

  // ─── Posts ──────────────────────────────────────────────────────────────────
  console.log('  → Posts');
  const postData = Array.from({ length: 60 }).map(() => ({
    content: faker.helpers
      .arrayElement([
        faker.lorem.sentence({ min: 6, max: 25 }),
        `${faker.hacker.phrase()}`,
        `Just ${faker.hacker.verb()}ed something cool 🚀`,
        `Hot take: ${faker.lorem.sentence({ min: 5, max: 18 })}`,
        `Reminder that ${faker.lorem.sentence({ min: 4, max: 15 })}`,
        `Can we talk about how ${faker.lorem.sentence({ min: 4, max: 14 })}`,
      ])
      .slice(0, 280),
    userId: pick(userIds),
    createdAt: faker.date.recent({ days: 60 }),
    deleted: false,
    imageUrl: faker.datatype.boolean(0.2)
      ? faker.image.urlPicsumPhotos({ width: 800, height: 600 })
      : null,
  }));

  await prisma.post.createMany({ data: postData });
  const posts = await prisma.post.findMany({ where: { replyId: null } });

  // ─── Replies ────────────────────────────────────────────────────────────────
  console.log('  → Replies');
  const replyData = [];
  for (const post of faker.helpers.arrayElements(
    posts,
    Math.floor(posts.length * 0.6)
  )) {
    const replyCount = faker.number.int({ min: 1, max: 5 });
    for (let i = 0; i < replyCount; i++) {
      replyData.push({
        content: faker.helpers
          .arrayElement([
            faker.lorem.sentence({ min: 3, max: 20 }),
            `Totally agree, ${faker.lorem.sentence({ min: 3, max: 10 })}`,
            `Nah I think ${faker.lorem.sentence({ min: 3, max: 12 })}`,
            `This. 💯`,
            `lmao ${faker.lorem.words(4)}`,
            `Wait, ${faker.lorem.sentence({ min: 4, max: 14 })}`,
          ])
          .slice(0, 280),
        userId: pick(userIds),
        replyId: post.id,
        createdAt: faker.date.between({ from: post.createdAt, to: new Date() }),
        deleted: false,
        imageUrl: null,
      });
    }
  }
  await prisma.post.createMany({ data: replyData });

  const allPosts = await prisma.post.findMany();

  // ─── Likes ──────────────────────────────────────────────────────────────────
  console.log('  → Likes');
  const likePairs = new Set<string>();
  for (const post of allPosts) {
    const likers = pickMany(userIds, 0, Math.min(8, userIds.length));
    for (const userId of likers) {
      likePairs.add(`${userId}-${post.id}`);
    }
  }

  await prisma.postLike.createMany({
    data: Array.from(likePairs).map(pair => {
      const [userId, postId] = pair.split('-').map(Number);
      return {
        userId,
        postId,
        createdAt: faker.date.recent({ days: 60 }),
      };
    }),
    skipDuplicates: true,
  });

  // ─── Bookmarks ──────────────────────────────────────────────────────────────
  console.log('  → Bookmarks');
  const bookmarkPairs = new Set<string>();
  for (const userId of userIds) {
    const saved = pickMany(allPosts, 1, 8);
    for (const post of saved) {
      bookmarkPairs.add(`${userId}-${post.id}`);
    }
  }

  await prisma.bookmark.createMany({
    data: Array.from(bookmarkPairs).map(pair => {
      const [userId, postId] = pair.split('-').map(Number);
      return {
        userId,
        postId,
        createdAt: faker.date.recent({ days: 30 }),
      };
    }),
    skipDuplicates: true,
  });

  // ─── Rooms & Messages ───────────────────────────────────────────────────────
  console.log('  → Rooms & Messages');
  const roomPairs = new Set<string>();
  for (const userId of userIds) {
    const partners = pickMany(
      userIds.filter(id => id !== userId),
      1,
      3
    );
    for (const partnerId of partners) {
      const key = [userId, partnerId].sort().join('-');
      roomPairs.add(key);
    }
  }

  for (const pair of roomPairs) {
    const [userAId, userBId] = pair.split('-').map(Number);

    const room = await prisma.room.create({
      data: { users: { connect: [{ id: userAId }, { id: userBId }] } },
    });

    const messageCount = faker.number.int({ min: 4, max: 20 });
    let lastTime = faker.date.recent({ days: 14 });

    for (let i = 0; i < messageCount; i++) {
      const senderId = faker.datatype.boolean() ? userAId : userBId;
      const receiverId = senderId === userAId ? userBId : userAId;
      const isLast = i === messageCount - 1;

      await prisma.message.create({
        data: {
          content: faker.helpers.arrayElement([
            faker.lorem.sentence({ min: 2, max: 15 }),
            faker.hacker.phrase(),
            'hey 👋',
            'sounds good!',
            'lol no way',
            `what do you think about ${faker.lorem.words(3)}?`,
            'ok let me check',
            'yeah for sure',
            'brb',
            faker.lorem.words(faker.number.int({ min: 1, max: 6 })),
          ]),
          roomId: room.id,
          senderId,
          receiverId,
          unread: isLast,
          createdAt: lastTime,
        },
      });

      lastTime = faker.date.between({ from: lastTime, to: new Date() });
    }
  }

  // ─── Notifications ──────────────────────────────────────────────────────────
  console.log('  → Notifications');
  const follows = await prisma.follow.findMany();
  const likes = await prisma.postLike.findMany({ include: { post: true } });
  const replies = await prisma.post.findMany({
    where: { replyId: { not: null } },
    include: { reply: true },
  });

  const notifications: {
    senderId: number;
    receiverId: number;
    content: string;
    postId?: number;
    replyContent?: string;
    createdAt: Date;
  }[] = [];

  // Follow notifications
  for (const follow of faker.helpers.arrayElements(
    follows,
    Math.min(follows.length, 30)
  )) {
    notifications.push({
      senderId: follow.followerId,
      receiverId: follow.followingId,
      content: 'followed you',
      createdAt: faker.date.recent({ days: 30 }),
    });
  }

  // Like notifications
  for (const like of faker.helpers.arrayElements(
    likes,
    Math.min(likes.length, 40)
  )) {
    if (like.userId === like.post.userId) continue;
    notifications.push({
      senderId: like.userId,
      receiverId: like.post.userId,
      content: 'liked your post',
      postId: like.postId,
      createdAt: faker.date.recent({ days: 30 }),
    });
  }

  // Reply notifications
  for (const reply of faker.helpers.arrayElements(
    replies,
    Math.min(replies.length, 30)
  )) {
    if (!reply.reply || reply.userId === reply.reply.userId) continue;
    notifications.push({
      senderId: reply.userId,
      receiverId: reply.reply.userId,
      content: 'replied to your post',
      postId: reply.replyId!,
      replyContent: reply.content,
      createdAt: faker.date.recent({ days: 30 }),
    });
  }

  await prisma.notification.createMany({
    data: notifications,
    skipDuplicates: true,
  });

  // ─── Summary ────────────────────────────────────────────────────────────────
  console.log('\n✅ Seeding complete!');
  console.log(`   Follows:       ${followPairs.size}`);
  console.log(`   Posts:         ${postData.length}`);
  console.log(`   Replies:       ${replyData.length}`);
  console.log(`   Likes:         ${likePairs.size}`);
  console.log(`   Bookmarks:     ${bookmarkPairs.size}`);
  console.log(`   Rooms:         ${roomPairs.size}`);
  console.log(`   Notifications: ${notifications.length}`);
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
