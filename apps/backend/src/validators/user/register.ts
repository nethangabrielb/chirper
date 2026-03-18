import { NextFunction, Request, Response } from 'express';

import { validationResult } from 'express-validator';

import type { RegistrationBody } from '../../types/auth.js';
import confirmPassword from '../rules/confirmPassword.js';
import email from '../rules/email.js';
import name from '../rules/name.js';
import password from '../rules/password.js';
import username from '../rules/username.js';

const registrationRules = [name, username, email, password, confirmPassword];

const validateRegistration = [
  ...registrationRules,
  (
    req: Request<object, object, RegistrationBody>,
    res: Response,
    next: NextFunction
  ) => {
    // Retrieve errors from express-validator on input fields
    const errors = validationResult(req);

    // Return errors if there are any
    if (!errors.isEmpty()) {
      const errorsArr = errors.array({ onlyFirstError: true });
      return res.json({
        status: 'success',
        data: errorsArr.map(err => err.msg),
        message: 'Error validating form input',
      });
    } else {
      delete req.body.confirmPassword;
      next();
    }
  },
];

export { validateRegistration };
