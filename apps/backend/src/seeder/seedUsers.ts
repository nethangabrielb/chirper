import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

import { prisma } from '../prisma/client';

async function main() {
  const users = [];

  for (let i = 0; i < 50; i++) {
    const name = faker.person.fullName();
    const username = faker.internet.username().toLowerCase() + i;
    const email = faker.internet.email().toLowerCase();
    const password = await bcrypt.hash('password123', 10);

    users.push({
      name,
      username,
      email,
      password,
      avatar: faker.image.avatar(),
      onboarded: faker.datatype.boolean(),
    });
  }

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
