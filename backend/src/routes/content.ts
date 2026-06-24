import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { optionalAuth } from '../middleware/auth';
import { getKanaGroups, getKanjiList, getDictionaryEntries, getLessonsForUser, getLessonById, getPracticeSessions } from '../services/content.service';

const router = Router();

router.use(optionalAuth);

router.get('/kana/hiragana', async (req, res, next) => {
  try {
    const data = await getKanaGroups(prisma, 'hiragana', req.authUser?.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/kana/katakana', async (req, res, next) => {
  try {
    const data = await getKanaGroups(prisma, 'katakana', req.authUser?.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/kana/learn', async (req, res, next) => {
  try {
    const { kanaIds, xpReward } = req.body;
    if (!Array.isArray(kanaIds)) {
      res.status(400).json({ error: 'kanaIds must be an array' });
      return;
    }
    
    // Dynamically import markKanaLearned since we didn't add it to imports yet
    const { markKanaLearned } = await import('../services/content.service');
    const data = await markKanaLearned(prisma, kanaIds, req.authUser?.id, xpReward);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/kanji', async (req, res, next) => {
  try {
    const level = typeof req.query.level === 'string' ? req.query.level : undefined;
    const data = await getKanjiList(prisma, { level }, req.authUser?.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/kanji/learn', async (req, res, next) => {
  try {
    const { kanjiId, xpReward } = req.body;
    if (!kanjiId) {
      res.status(400).json({ error: 'kanjiId is required' });
      return;
    }
    if (req.authUser?.id) {
      await prisma.userKanji.upsert({
        where: { userId_kanjiId: { userId: req.authUser.id, kanjiId } },
        create: { userId: req.authUser.id, kanjiId },
        update: {}
      });
      if (xpReward > 0) {
        const { grantXp } = await import('../services/user.service');
        await grantXp(prisma, req.authUser.id, xpReward, { source: 'kanji_study' });
      }
    }
    res.json({ success: true });
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

router.get('/practice', async (req, res, next) => {
  try {
    const data = await getPracticeSessions(prisma, req.authUser?.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default router;
