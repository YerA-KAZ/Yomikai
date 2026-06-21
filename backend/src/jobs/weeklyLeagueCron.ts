import cron from 'node-cron';
import { prisma } from '../lib/prisma';
import { runWeeklyLeaguePromotion } from '../services/league.service';

let scheduled = false;

export function startWeeklyLeagueCron(): void {
  if (scheduled) {
    return;
  }

  scheduled = true;
  cron.schedule('59 23 * * 0', async () => {
    try {
      await runWeeklyLeaguePromotion(prisma);
      console.log('[cron] Weekly league promotion completed');
    } catch (error) {
      console.error('[cron] Weekly league promotion failed', error);
    }
  });
}

