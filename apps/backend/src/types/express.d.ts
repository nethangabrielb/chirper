import 'express';

import type { User } from './user.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}
