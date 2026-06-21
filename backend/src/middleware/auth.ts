import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { HttpError } from '../lib/http';
import { resolveAuthUser } from '../services/auth.service';

function extractToken(req: Request): string | null {
  const header = req.header('authorization') ?? req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    return null;
  }
  return header.slice('Bearer '.length).trim();
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token = extractToken(req);
  if (!token) {
    next();
    return;
  }

  const user = await resolveAuthUser(prisma, token);
  if (user) {
    req.authUser = user;
  }

  next();
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token = extractToken(req);
  if (!token) {
    next(new HttpError(401, 'Authentication required'));
    return;
  }

  const user = await resolveAuthUser(prisma, token);
  if (!user) {
    next(new HttpError(401, 'Invalid or expired token'));
    return;
  }

  req.authUser = user;
  next();
}

export function requireRole(role: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.authUser) {
      next(new HttpError(401, 'Authentication required'));
      return;
    }

    if (req.authUser.role !== role) {
      next(new HttpError(403, 'Forbidden'));
      return;
    }

    next();
  };
}

