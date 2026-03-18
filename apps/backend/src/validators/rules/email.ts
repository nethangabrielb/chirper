import { body } from 'express-validator';

import { prisma } from '../../prisma/client.js';

export default body('email')
  .exists()
  .withMessage('Email is required.')
  .trim()
  .notEmpty()
  .withMessage("Email can't be empty.")
  .isEmail()
  .withMessage('Input must be an email.')
  .custom(async value => {
    const user = await prisma.user.findUnique({
      where: {
        email: value,
      },
    });
    if (user?.email === value) {
      throw new Error('Email is already taken.');
    }
  });
