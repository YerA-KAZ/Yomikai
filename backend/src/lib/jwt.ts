import jwt from 'jsonwebtoken';
import { env } from './env';

export interface JwtPayload {
  sub: string;
  role: string;
}

const MOCK_USER_ID = 'mock-admin-user';

export function signToken(userId: string, role: string): string {
  return jwt.sign({ sub: userId, role } satisfies JwtPayload, env.jwtSecret, {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}

export function isMockAuthToken(token: string): boolean {
  return token === env.mockAuthToken;
}

export function getMockUserId(): string {
  return MOCK_USER_ID;
}
