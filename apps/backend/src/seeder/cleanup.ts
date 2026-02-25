import { prisma } from '../prisma/client';

async function main() {
  await prisma.bookmark.deleteMany();
  await prisma.postLike.deleteMany();
  await prisma.post.deleteMany();
}

main().finally(() => prisma.$disconnect());
