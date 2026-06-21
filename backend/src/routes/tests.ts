import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';
import { submitTestResult } from '../services/test.service';

const router = Router();

router.use(requireAuth);

const answersSchema = z.object({
  questionId: z.string().min(1),
  userAnswer: z.string(),
  correct: z.boolean(),
});

const submitSchema = z.object({
  testId: z.string().min(1),
  score: z.number().int().nonnegative(),
  totalQuestions: z.number().int().positive(),
  correctAnswers: z.number().int().nonnegative(),
  timeSpent: z.number().int().nonnegative(),
  completedAt: z.string().datetime(),
  answers: z.array(answersSchema),
});

router.post('/submit', async (req, res, next) => {
  try {
    const body = submitSchema.parse(req.body);
    const result = await submitTestResult(prisma, req.authUser!.id, body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;

