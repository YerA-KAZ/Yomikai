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
  hint: z.string().optional(),
  strokes: z.array(z.object({
    paths: z.array(z.string().min(1)),
    order: z.number().int().nonnegative(),
  })).default([]),
  words: z.array(z.object({
    word: z.string(),
    reading: z.string(),
    meaning: z.string(),
  })).default([]),
});

const questionTypeEnum = z.enum([
  'kana_symbol_to_reading',
  'kana_reading_to_symbol',
  'kana_fill_blank',
  'kanji_to_meaning',
  'meaning_to_kanji',
  'word_to_reading',
  'kanji_in_context',
  'word_composition',
]);

const testSchema = z.object({
  lessonId: z.string().min(1),
  type: questionTypeEnum,
  question: z.string().min(1),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1),
  hint: z.string().optional(),
  explanation: z.string().optional(),
});

const lessonSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['hiragana', 'katakana', 'kanji', 'vocabulary', 'grammar']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  xpReward: z.number().int().positive(),
  estimatedTime: z.number().int().positive(),
});

router.get('/users', async (_req, res, next) => {
  try {
    const users = await listUsersForAdmin(prisma);
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/dictionary', async (_req, res, next) => {
  try {
    const items = await prisma.vocabulary.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.delete('/dictionary/:id', async (req, res, next) => {
  try {
    await prisma.vocabulary.delete({ where: { id: req.params.id } });
    res.status(204).send();
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
        hint: body.hint,
        strokes: body.strokes,
        words: body.words,
        sortOrder: await prisma.kanji.count(),
      },
    });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

router.get('/lessons', async (_req, res, next) => {
  try {
    const lessons = await prisma.lesson.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { questions: true } },
      },
    });
    res.json(lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      type: lesson.type,
      difficulty: lesson.difficulty,
      xpReward: lesson.xpReward,
      estimatedTime: lesson.estimatedTime,
      questionCount: lesson._count.questions,
    })));
  } catch (error) {
    next(error);
  }
});

router.post('/lessons', async (req, res, next) => {
  try {
    const body = lessonSchema.parse(req.body);
    const lesson = await prisma.lesson.create({
      data: {
        ...body,
        sortOrder: await prisma.lesson.count(),
      },
    });
    res.status(201).json(lesson);
  } catch (error) {
    next(error);
  }
});

router.get('/tests', async (_req, res, next) => {
  try {
    const questions = await prisma.testQuestion.findMany({
      orderBy: [{ lessonId: 'asc' }, { sortOrder: 'asc' }],
      include: {
        lesson: { select: { title: true, type: true } },
      },
    });
    res.json(questions.map((question) => ({
      id: question.id,
      lessonId: question.lessonId,
      lessonTitle: question.lesson.title,
      lessonType: question.lesson.type,
      type: question.type,
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      hint: question.hint,
      explanation: question.explanation,
      sortOrder: question.sortOrder,
    })));
  } catch (error) {
    next(error);
  }
});

router.delete('/tests/:id', async (req, res, next) => {
  try {
    await prisma.testQuestion.delete({ where: { id: req.params.id } });
    res.status(204).send();
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
