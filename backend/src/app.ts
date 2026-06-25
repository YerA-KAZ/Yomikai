import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import contentRouter from './routes/content';
import leaderboardRouter from './routes/leaderboard';
import testsRouter from './routes/tests';
import adminRouter from './routes/admin';
import { cronRouter } from './routes/cron';
import { env } from './lib/env';
import { errorHandler, notFound } from './middleware/errors';

export const app = express();

app.disable('x-powered-by');

app.use(
  cors({
    origin: env.frontendOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/users', userRouter);
app.use('/api', contentRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/tests', testsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/cron', cronRouter);

app.use(notFound);
app.use(errorHandler);

export default app;

