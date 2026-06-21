import bcrypt from 'bcrypt';
import type { Prisma, PrismaClient, User as DbUser } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { HttpError } from '../lib/http';
import { signToken, isMockAuthToken } from '../lib/jwt';
import { ensureUserAchievementRows, buildUserProfile } from './user.service';
import { ensureUserLeagueParticipant } from './league.service';

type DbClient = PrismaClient | Prisma.TransactionClient;

export interface AuthResponseDto {
  token: string;
  user: Awaited<ReturnType<typeof buildUserProfile>> & { role: string };
}

export async function registerUser(
  client: DbClient = prisma,
  input: { email: string; password: string; name: string },
): Promise<AuthResponseDto> {
  const existing = await client.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (existing) {
    throw new HttpError(409, 'User already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await client.user.create({
    data: {
      email: input.email.toLowerCase(),
      passwordHash,
      name: input.name,
    },
  });

  await ensureUserAchievementRows(client, user.id);
  await ensureUserLeagueParticipant(user.id, client);

  const profile = await buildUserProfile(client, user.id);
  return {
    token: signToken(user.id, user.role),
    user: {
      ...profile,
      role: user.role,
    },
  };
}

export async function loginUser(
  client: DbClient = prisma,
  input: { email: string; password: string },
): Promise<AuthResponseDto> {
  const user = await client.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const profile = await buildUserProfile(client, user.id);
  return {
    token: signToken(user.id, user.role),
    user: {
      ...profile,
      role: user.role,
    },
  };
}

export async function resolveAuthUser(client: DbClient = prisma, token: string): Promise<DbUser | null> {
  if (isMockAuthToken(token)) {
    return client.user.findUnique({
      where: { email: 'admin@yomikai.ru' },
    });
  }

  try {
    const { verifyToken } = await import('../lib/jwt');
    const payload = verifyToken(token);
    return client.user.findUnique({
      where: { id: payload.sub },
    });
  } catch {
    return null;
  }
}
