import { Router } from 'express';
import { runWeeklyLeaguePromotion } from '../services/league.service';

export const cronRouter = Router();

// Middleware to protect cron endpoints
cronRouter.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;
  
  if (!cronSecret) {
    console.warn('CRON_SECRET is not configured in environment variables');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
});

cronRouter.all('/weekly-update', async (req, res) => {
  try {
    await runWeeklyLeaguePromotion();
    return res.json({ success: true, message: 'Weekly promotion completed successfully' });
  } catch (err) {
    console.error('Error running weekly promotion:', err);
    return res.status(500).json({ error: 'Failed to run weekly promotion' });
  }
});
