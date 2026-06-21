import type { User as DbUser } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      authUser?: DbUser;
    }
  }
}

export {};
