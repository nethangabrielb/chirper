import { faker } from '@faker-js/faker';

import { prisma } from '../prisma/client';

// Adjust path to your generated client

const TECH_STACKS = [
  'React',
  'Next.js',
  'TypeScript',
  'Rust',
  'Prisma',
  'PostgreSQL',
  'Tailwind CSS',
  'Zustand',
];
const TOPICS = [
  'web dev',
  'AI',
  'productivity',
  'open source',
  'coding bootcamps',
  'remote work',
];

const postTemplates = [
  'Just migrated my project to {tech}. The performance boost is insane! 🚀',
  'Unpopular opinion: {tech} is better than {tech2} for scaling startups.',
  'Does anyone else feel like {topic} is getting way too much hype lately?',
  'Building a new {topic} tool with {tech}. Stay tuned! 💻',
  'Finally fixed that memory leak in my {tech} app. Best feeling ever.',
  'What is your go-to library for {topic} in 2026?',
  'Just reached a major milestone on my {tech} journey! 🏆',
  'Currently deep diving into {tech} documentation. My brain is melting.',
  "If you aren't using {tech} for {topic}, you are missing out.",
  'Coffee + {tech} + 🎧 = Productivity mode activated.',
];

function generateRealisticContent() {
  const template = faker.helpers.arrayElement(postTemplates);
  return template
    .replace('{tech}', faker.helpers.arrayElement(TECH_STACKS))
    .replace(
      '{tech2}',
      faker.helpers.arrayElement(TECH_STACKS.filter(t => t !== template))
    )
    .replace('{topic}', faker.helpers.arrayElement(TOPICS));
}

async function main() {
  console.log('Emptying database...');
  await prisma.notification.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.postLike.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.message.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const users = await prisma.user.findMany();
  const userIds = users.map(u => u.id);

  console.log('Seeding parent posts...');
  for (const userId of userIds) {
    const numPosts = faker.number.int({ min: 2, max: 5 });
    for (let i = 0; i < numPosts; i++) {
      await prisma.post.create({
        data: {
          content: generateRealisticContent(),
          userId: userId,
          imageUrl: Math.random() > 0.8 ? faker.image.urlPicsumPhotos() : null,
        },
      });
    }
  }

  const parentPosts = await prisma.post.findMany({ where: { replyId: null } });
  const parentIds = parentPosts.map(p => p.id);

  console.log('Seeding replies...');
  const replyTemplates = [
    'Totally agree with this!',
    'I had the same experience with {tech}.',
    'Can you share the repo for this?',
    'Interesting take, but have you considered {tech2}?',
    'This helped me so much, thanks for sharing!',
    'Wait, how did you solve the {topic} issue?',
  ];

  for (let i = 0; i < 40; i++) {
    const template = faker.helpers.arrayElement(replyTemplates);
    const content = template
      .replace('{tech}', faker.helpers.arrayElement(TECH_STACKS))
      .replace('{tech2}', faker.helpers.arrayElement(TECH_STACKS))
      .replace('{topic}', faker.helpers.arrayElement(TOPICS));

    await prisma.post.create({
      data: {
        content,
        userId: faker.helpers.arrayElement(userIds),
        replyId: faker.helpers.arrayElement(parentIds),
      },
    });
  }

  console.log('Seeding follows...');
  for (const followerId of userIds) {
    const followings = faker.helpers.arrayElements(
      userIds.filter(id => id !== followerId),
      { min: 3, max: 7 }
    );
    for (const followingId of followings) {
      await prisma.follow
        .create({
          data: { followerId, followingId },
        })
        .catch(() => {}); // Ignore duplicate follows
    }
  }

  console.log('Seeding likes and bookmarks...');
  const allPosts = await prisma.post.findMany();
  const allPostIds = allPosts.map(p => p.id);

  for (const userId of userIds) {
    // Likes
    const postsToLike = faker.helpers.arrayElements(allPostIds, {
      min: 5,
      max: 15,
    });
    for (const postId of postsToLike) {
      await prisma.postLike
        .create({
          data: { userId, postId },
        })
        .catch(() => {});
    }

    // Bookmarks
    const postsToBookmark = faker.helpers.arrayElements(allPostIds, {
      min: 2,
      max: 5,
    });
    for (const postId of postsToBookmark) {
      await prisma.bookmark
        .create({
          data: { userId, postId },
        })
        .catch(() => {});
    }
  }

  console.log('Seeding completed successfully.');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
