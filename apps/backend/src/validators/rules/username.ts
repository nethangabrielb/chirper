import { body } from 'express-validator';

import { prisma } from '../../prisma/client.js';

export default body('username')
  .exists()
  .withMessage('Username is required.')
  .trim()
  .notEmpty()
  .withMessage("Username can't be empty.")
  .custom(async value => {
    const user = await prisma.user.findUnique({
      where: {
        username: value,
      },
    });
    if (user?.username === value) {
      throw new Error('Username is already taken.');
    }
  });
