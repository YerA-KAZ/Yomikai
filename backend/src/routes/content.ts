import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { optionalAuth } from '../middleware/auth';
import { getKanaGroups, getKanjiList, getDictionaryEntries, getLessonsForUser, getLessonById, getPracticeSessions } from '../services/content.service';

const router = Router();

router.use(optionalAuth);

router.get('/kana/hiragana', async (_req, res, next) => {
  try {
    const data = await getKanaGroups(prisma, 'hiragana');
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/kana/katakana', async (_req, res, next) => {
  try {
    const data = await getKanaGroups(prisma, 'katakana');
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/kanji', async (req, res, next) => {
  try {
    const level = typeof req.query.level === 'string' ? req.query.level : undefined;
    const data = await getKanjiList(prisma, { level });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/dictionary', async (req, res, next) => {
  try {
    const jlpt = typeof req.query.jlpt === 'string' ? req.query.jlpt : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    const data = await getDictionaryEntries(prisma, { jlpt, search, q });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/lessons', async (req, res, next) => {
  try {
    const data = await getLessonsForUser(prisma, req.authUser?.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/lessons/:id', async (req, res, next) => {
  try {
    const data = await getLessonById(prisma, req.params.id, req.authUser?.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/practice', async (_req, res, next) => {
  try {
    const data = await getPracticeSessions(prisma);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default router;
