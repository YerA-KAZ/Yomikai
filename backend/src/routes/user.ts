import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';
import { buildUserProfile, buildUserStats, grantXp, updateUserProfile } from '../services/user.service';

const router = Router();

router.use(requireAuth);

const xpSchema = z.object({
  amount: z.number().int().positive(),
  source: z.string().min(1),
  minutesSpent: z.number().int().nonnegative().optional(),
});

const updateProfileSchema = z.object({
  name: z.string().trim().min(1).optional(),
  avatar: z.string().min(1).optional(),
  dailyGoal: z.number().int().positive().optional(),
  learnedKana: z.number().int().nonnegative().optional(),
  learnedKanji: z.number().int().nonnegative().optional(),
  learnedWords: z.number().int().nonnegative().optional(),
});

router.get('/me', async (req, res, next) => {
  try {
    const user = await buildUserProfile(prisma, req.authUser!.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/stats', async (req, res, next) => {
  try {
    const stats = await buildUserStats(prisma, req.authUser!.id);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

router.get('/me/activity', async (req, res, next) => {
  try {
    const stats = await buildUserStats(prisma, req.authUser!.id);
    res.json(stats.weeklyActivity);
  } catch (error) {
    next(error);
  }
});

router.post('/me/xp', async (req, res, next) => {
  try {
    const body = xpSchema.parse(req.body);
    const user = await grantXp(prisma, req.authUser!.id, body.amount, {
      source: body.source,
      minutesSpent: body.minutesSpent,
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/me', async (req, res, next) => {
  try {
    const body = updateProfileSchema.parse(req.body);
    const user = await updateUserProfile(prisma, req.authUser!.id, body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
