import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';
import { deleteUser, listUsersForAdmin, resetUserXp } from '../services/user.service';

const router = Router();

router.use(requireAuth);
router.use(requireRole('admin'));

const dictionarySchema = z.object({
  word: z.string().min(1),
  reading: z.string().min(1),
  meaning: z.string().min(1),
  partOfSpeech: z.string().min(1),
  jlptLevel: z.enum(['N5', 'N4', 'N3', 'N2', 'N1']),
  examples: z.array(z.object({
    japanese: z.string(),
    russian: z.string(),
  })).default([]),
  tags: z.array(z.string()).default([]),
});

const kanjiSchema = z.object({
  char: z.string().min(1),
  meaning: z.string().min(1),
  onyomi: z.array(z.string()).default([]),
  kunyomi: z.array(z.string()).default([]),
  jlptLevel: z.enum(['N5', 'N4', 'N3', 'N2', 'N1']),
  strokeCount: z.number().int().positive(),
  examples: z.array(z.object({
    word: z.string(),
    reading: z.string(),
    meaning: z.string(),
  })).default([]),
  radical: z.string().min(1),
  learned: z.boolean().optional(),
});

const testSchema = z.object({
  lessonId: z.string().min(1),
  type: z.enum(['multiple_choice', 'typing', 'matching', 'listening']),
  question: z.string().min(1),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1),
  hint: z.string().optional(),
  explanation: z.string().optional(),
});

router.get('/users', async (_req, res, next) => {
  try {
    const users = await listUsersForAdmin(prisma);
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.post('/dictionary', async (req, res, next) => {
  try {
    const body = dictionarySchema.parse(req.body);
    const item = await prisma.vocabulary.create({
      data: {
        ...body,
        sortOrder: await prisma.vocabulary.count(),
      },
    });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

router.post('/kanji', async (req, res, next) => {
  try {
    const body = kanjiSchema.parse(req.body);
    const item = await prisma.kanji.create({
      data: {
        char: body.char,
        meaning: body.meaning,
        onyomi: body.onyomi,
        kunyomi: body.kunyomi,
        jlptLevel: body.jlptLevel,
        strokeCount: body.strokeCount,
        examples: body.examples,
        radical: body.radical,
        learned: body.learned ?? false,
        sortOrder: await prisma.kanji.count(),
      },
    });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

router.post('/tests', async (req, res, next) => {
  try {
    const body = testSchema.parse(req.body);
    const lesson = await prisma.lesson.findUnique({
      where: { id: body.lessonId },
    });
    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }

    const question = await prisma.testQuestion.create({
      data: {
        lessonId: body.lessonId,
        type: body.type,
        question: body.question,
        options: body.options,
        correctAnswer: body.correctAnswer,
        hint: body.hint,
        explanation: body.explanation,
        sortOrder: await prisma.testQuestion.count({
          where: { lessonId: body.lessonId },
        }),
      },
    });

    res.status(201).json(question);
  } catch (error) {
    next(error);
  }
});

router.post('/users/:id/reset', async (req, res, next) => {
  try {
    const user = await resetUserXp(prisma, req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.delete('/users/:id', async (req, res, next) => {
  try {
    await deleteUser(prisma, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
