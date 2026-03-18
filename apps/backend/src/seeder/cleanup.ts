import { prisma } from '../prisma/client.js';

async function main() {
  await prisma.notification.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.postLike.deleteMany();
  await prisma.message.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.federatedCredentials.deleteMany();

  await prisma.post.deleteMany();
  await prisma.room.deleteMany();

  await prisma.user.deleteMany();
}

main().finally(() => prisma.$disconnect());
