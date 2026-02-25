import { faker } from '@faker-js/faker';

import { prisma } from '../prisma/client';

async function main() {
  const users = await prisma.user.findMany();

  if (users.length === 0) {
    console.log('No users found. Seed users first.');
    return;
  }

  const userIds = users.map(u => u.id);

  // ---------- POSTS ----------
  const posts = [];

  for (const user of users) {
    const postCount = faker.number.int({ min: 1, max: 5 });

    for (let i = 0; i < postCount; i++) {
      posts.push({
        content: faker.lorem.sentence(10),
        userId: user.id,
      });
    }
  }

  await prisma.post.createMany({ data: posts });

  const allPosts = await prisma.post.findMany();
  const postIds = allPosts.map(p => p.id);

  // ---------- FOLLOWS ----------
  const follows = [];

  for (let i = 0; i < 150; i++) {
    const follower = faker.helpers.arrayElement(userIds);
    const following = faker.helpers.arrayElement(userIds);

    if (follower !== following) {
      follows.push({
        followerId: follower,
        followingId: following,
      });
    }
  }

  await prisma.follow.createMany({
    data: follows,
    skipDuplicates: true,
  });

  // ---------- LIKES ----------
  const likes = [];

  for (let i = 0; i < 200; i++) {
    likes.push({
      userId: faker.helpers.arrayElement(userIds),
      postId: faker.helpers.arrayElement(postIds),
    });
  }

  await prisma.postLike.createMany({
    data: likes,
    skipDuplicates: true,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async e => {
    console.error(e);
    process.exit(1);
  });
