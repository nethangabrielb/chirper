import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

import { prisma } from '../prisma/client';

async function main() {
  const usernameSet = new Set();
  const emailSet = new Set();

  const users = [];

  while (users.length < 50) {
    const name = faker.person.fullName();
    const username = faker.internet.username().toLowerCase();
    const email = faker.internet.email().toLowerCase();

    if (usernameSet.has(username) || emailSet.has(email)) continue;

    usernameSet.add(username);
    emailSet.add(email);

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
  });
}

main().finally(() => prisma.$disconnect());
