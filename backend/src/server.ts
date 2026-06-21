import app from './app';
import { env } from './lib/env';
import { ensureDefaultLeagues } from './services/league.service';
import { startWeeklyLeagueCron } from './jobs/weeklyLeagueCron';

async function bootstrap(): Promise<void> {
  await ensureDefaultLeagues();
  startWeeklyLeagueCron();

  app.listen(env.port, () => {
    console.log(`Yomikai backend listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start backend', error);
  process.exit(1);
});

