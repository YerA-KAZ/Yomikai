import type { PrismaClient } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { HttpError } from '../lib/http';
import { grantXpInTransaction } from './user.service';

export interface TestResultInput {
  testId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: string;
  answers: { questionId: string; userAnswer: string; correct: boolean }[];
}

const COMPLETION_THRESHOLD = 100;

export async function submitTestResult(
  client: PrismaClient = prisma,
  userId: string,
  input: TestResultInput,
): Promise<{ success: boolean; xpAwarded: number }> {
  const lesson = await client.lesson.findUnique({ where: { id: input.testId } });
  if (!lesson) {
    throw new HttpError(404, 'Lesson not found');
  }

  const completedAt = new Date(input.completedAt);
  const percentage = input.totalQuestions > 0
    ? Math.round((input.correctAnswers / input.totalQuestions) * 100)
    : 0;
  const xpAwarded = Math.max(0, input.correctAnswers * 10);
  const minutesSpent = Math.max(1, Math.round(input.timeSpent / 60));

  await client.$transaction(async (tx) => {
    await tx.testAttempt.create({
      data: {
        userId,
        lessonId: input.testId,
        score: input.score,
        totalQuestions: input.totalQuestions,
        correctAnswers: input.correctAnswers,
        timeSpent: input.timeSpent,
        completedAt,
        answers: input.answers,
        xpAwarded,
      },
    });

    const existingProgress = await tx.userLessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId: input.testId,
        },
      },
    });

    const nextProgress = Math.max(existingProgress?.progress ?? 0, percentage);

    if (existingProgress) {
      await tx.userLessonProgress.update({
        where: {
          userId_lessonId: {
            userId,
            lessonId: input.testId,
          },
        },
        data: {
          progress: nextProgress,
          lastAccessed: completedAt,
          xpEarned: { increment: xpAwarded },
          completedAt: nextProgress >= COMPLETION_THRESHOLD ? completedAt : existingProgress.completedAt,
        },
      });
    } else {
      await tx.userLessonProgress.create({
        data: {
          userId,
          lessonId: input.testId,
          progress: nextProgress,
          lastAccessed: completedAt,
          xpEarned: xpAwarded,
          completedAt: nextProgress >= COMPLETION_THRESHOLD ? completedAt : null,
        },
      });
    }

    await grantXpInTransaction(tx, userId, xpAwarded, {
      source: `test:${input.testId}`,
      minutesSpent,
    });
  });

  return {
    success: true,
    xpAwarded,
  };
}
