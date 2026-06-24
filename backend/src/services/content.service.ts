import type { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { HttpError } from '../lib/http';

type DbClient = PrismaClient | Prisma.TransactionClient;

export interface KanaCharDto {
  id: string;
  char: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
  group: string;
  examples: { word: string; reading: string; meaning: string }[];
  learned: boolean;
  strokeOrder?: string[];
}

export interface KanaGroupDto {
  id: string;
  name: string;
  nameJp: string;
  chars: KanaCharDto[];
}

export interface KanjiCharDto {
  id: string;
  char: string;
  onyomi: string[];
  kunyomi: string[];
  meaning: string;
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  strokeCount: number;
  examples: { word: string; reading: string; meaning: string }[];
  radical: string;
  learned: boolean;
  hint?: string;
  strokes?: { paths: string[]; order: number }[];
  words?: { word: string; reading: string; meaning: string }[];
}

export interface DictionaryEntryDto {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  partOfSpeech: string;
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  examples: { japanese: string; russian: string }[];
  tags: string[];
}

export type QuestionTypeDto =
  | 'kana_symbol_to_reading'
  | 'kana_reading_to_symbol'
  | 'kana_fill_blank'
  | 'kanji_to_meaning'
  | 'meaning_to_kanji'
  | 'word_to_reading'
  | 'kanji_in_context'
  | 'word_composition';

export interface QuestionDto {
  id: string;
  type: QuestionTypeDto;
  question: string;
  options?: string[];
  correctAnswer: string;
  hint?: string;
  explanation?: string;
}

export interface LessonDto {
  id: string;
  title: string;
  description: string;
  type: 'hiragana' | 'katakana' | 'kanji' | 'vocabulary' | 'grammar';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  estimatedTime: number;
  completed: boolean;
  questions: QuestionDto[];
}

export interface PracticeSessionDto {
  id: string;
  type: 'flashcards' | 'writing' | 'matching' | 'quiz';
  title: string;
  description: string;
  icon: string;
  itemCount: number;
  completedCount: number;
  accuracy: number;
}

function mapQuestion(question: {
  id: string;
  type: string;
  question: string;
  options: unknown;
  correctAnswer: string;
  hint: string | null;
  explanation: string | null;
}): QuestionDto {
  return {
    id: question.id,
    type: question.type as QuestionDto['type'],
    question: question.question,
    options: Array.isArray(question.options) ? question.options.map(String) : undefined,
    correctAnswer: question.correctAnswer,
    hint: question.hint ?? undefined,
    explanation: question.explanation ?? undefined,
  };
}

export async function getKanaGroups(client: DbClient = prisma, type: 'hiragana' | 'katakana', userId?: string): Promise<KanaGroupDto[]> {
  const groups = await client.kanaGroup.findMany({
    where: { type },
    orderBy: { sortOrder: 'asc' },
    include: {
      chars: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  const learnedMap = new Set<string>();
  if (userId) {
    const userKanas = await client.userKana.findMany({
      where: { userId },
      select: { kanaId: true }
    });
    userKanas.forEach(uk => learnedMap.add(uk.kanaId));
  }

  return groups.map((group) => ({
    id: group.id,
    name: group.name,
    nameJp: group.nameJp,
    chars: group.chars.map((char) => ({
      id: char.id,
      char: char.char,
      romaji: char.romaji,
      type: char.type as KanaCharDto['type'],
      group: char.groupCode,
      examples: Array.isArray(char.examples) ? char.examples as KanaCharDto['examples'] : [],
      learned: userId ? learnedMap.has(char.id) : char.learned,
      strokeOrder: Array.isArray(char.strokeOrder) ? char.strokeOrder.map(String) : undefined,
    })),
  }));
}

export async function getKanjiList(client: DbClient = prisma, filters: { level?: string } = {}, userId?: string): Promise<KanjiCharDto[]> {
  const where = filters.level ? { jlptLevel: filters.level } : undefined;
  const items = await client.kanji.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
  });

  const learnedMap = new Set<string>();
  if (userId) {
    const userKanjis = await client.userKanji.findMany({
      where: { userId },
      select: { kanjiId: true }
    });
    userKanjis.forEach(uk => learnedMap.add(uk.kanjiId));
  }

  return items.map((item) => ({
    id: item.id,
    char: item.char,
    onyomi: Array.isArray(item.onyomi) ? item.onyomi.map(String) : [],
    kunyomi: Array.isArray(item.kunyomi) ? item.kunyomi.map(String) : [],
    meaning: item.meaning,
    jlptLevel: item.jlptLevel as KanjiCharDto['jlptLevel'],
    strokeCount: item.strokeCount,
    examples: Array.isArray(item.examples) ? item.examples as KanjiCharDto['examples'] : [],
    radical: item.radical,
    learned: userId ? learnedMap.has(item.id) : item.learned,
    hint: item.hint ?? undefined,
    strokes: Array.isArray(item.strokes) ? item.strokes as KanjiCharDto['strokes'] : undefined,
    words: Array.isArray(item.words) ? item.words as KanjiCharDto['words'] : undefined,
  }));
}

export async function getDictionaryEntries(
  client: DbClient = prisma,
  filters: { jlpt?: string; search?: string; q?: string } = {},
): Promise<DictionaryEntryDto[]> {
  const items = await client.vocabulary.findMany({
    orderBy: { sortOrder: 'asc' },
    where: filters.jlpt ? { jlptLevel: filters.jlpt } : undefined,
  });

  const search = (filters.search ?? filters.q ?? '').trim().toLowerCase();
  const filtered = search
    ? items.filter((item) => {
      const values = [
        item.word,
        item.reading,
        item.meaning,
        item.partOfSpeech,
        JSON.stringify(item.tags),
      ].join(' ').toLowerCase();
      return values.includes(search);
    })
    : items;

  return filtered.map((item) => ({
    id: item.id,
    word: item.word,
    reading: item.reading,
    meaning: item.meaning,
    partOfSpeech: item.partOfSpeech,
    jlptLevel: item.jlptLevel as DictionaryEntryDto['jlptLevel'],
    examples: Array.isArray(item.examples) ? item.examples as DictionaryEntryDto['examples'] : [],
    tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
  }));
}

export async function getLessonsForUser(client: DbClient = prisma, userId?: string): Promise<LessonDto[]> {
  const lessons = await client.lesson.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      questions: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  const completedMap = new Map<string, boolean>();
  if (userId) {
    const progress = await client.userLessonProgress.findMany({
      where: { userId },
      select: { lessonId: true, progress: true },
    });
    for (const item of progress) {
      completedMap.set(item.lessonId, item.progress >= 100);
    }
  }

  return lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    type: lesson.type as LessonDto['type'],
    difficulty: lesson.difficulty as LessonDto['difficulty'],
    xpReward: lesson.xpReward,
    estimatedTime: lesson.estimatedTime,
    completed: completedMap.get(lesson.id) ?? false,
    questions: lesson.questions.map(mapQuestion),
  }));
}

export async function getLessonById(client: DbClient = prisma, lessonId: string, userId?: string): Promise<LessonDto> {
  const lesson = await client.lesson.findUnique({
    where: { id: lessonId },
    include: {
      questions: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!lesson) {
    throw new HttpError(404, 'Lesson not found');
  }

  let completed = false;
  if (userId) {
    const progress = await client.userLessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      select: { progress: true },
    });
    completed = (progress?.progress ?? 0) >= 100;
  }

  return {
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    type: lesson.type as LessonDto['type'],
    difficulty: lesson.difficulty as LessonDto['difficulty'],
    xpReward: lesson.xpReward,
    estimatedTime: lesson.estimatedTime,
    completed,
    questions: lesson.questions.map(mapQuestion),
  };
}

export async function getPracticeSessions(client: DbClient = prisma, userId?: string): Promise<PracticeSessionDto[]> {
  const sessions = await client.practiceSession.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  const sessionMap = new Map<string, { completedCount: number; accuracy: number }>();
  if (userId) {
    const userSessions = await client.userPracticeSession.findMany({
      where: { userId },
    });
    userSessions.forEach(us => sessionMap.set(us.sessionId, { completedCount: us.completedCount, accuracy: us.accuracy }));
  }

  return sessions.map((session) => {
    const userSession = sessionMap.get(session.id);
    return {
      id: session.id,
      type: session.type as PracticeSessionDto['type'],
      title: session.title,
      description: session.description,
      icon: session.icon,
      itemCount: session.itemCount,
      completedCount: userSession ? userSession.completedCount : session.completedCount,
      accuracy: userSession ? userSession.accuracy : session.accuracy,
    };
  });
}

export async function getLessonProgressSummary(client: DbClient = prisma, lessonId: string, userId: string) {
  const progress = await client.userLessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
  });

  return progress;
}

export async function markKanaLearned(
  client: DbClient = prisma,
  kanaIds: string[],
  userId?: string,
  xpReward?: number,
): Promise<{ success: true }> {
  if (userId) {
    // Update the user-specific kana learned state
    await Promise.all(kanaIds.map(kanaId => 
      client.userKana.upsert({
        where: { userId_kanaId: { userId, kanaId } },
        create: { userId, kanaId },
        update: {}
      })
    ));
    // Increase learnedKana count on User
    await client.user.update({
      where: { id: userId },
      data: { learnedKana: { increment: kanaIds.length } },
    });

    if (xpReward && xpReward > 0) {
      // Lazy import grantXp to avoid circular dependencies
      const { grantXp } = await import('./user.service');
      await grantXp(client, userId, xpReward, { source: 'kana_study' });
    }
  }

  return { success: true };
}
