import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';
import { getAllTimeLeaderboard, getLeaderboardForUser } from '../services/league.service';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const scope = typeof req.query.scope === 'string' ? req.query.scope : 'weekly';
    const data = scope === 'all-time' || scope === 'alltime'
      ? await getAllTimeLeaderboard(req.authUser!.id, prisma)
      : await getLeaderboardForUser(req.authUser!.id, prisma);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default router;
