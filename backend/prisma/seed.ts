import bcrypt from 'bcrypt';
import { Prisma, PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { addDays, startOfDay } from '../src/lib/dates';
import { ensureDefaultLeagues } from '../src/services/league.service';
import { syncAchievementProgress } from '../src/services/user.service';

const prisma = new PrismaClient();

function loadMockModule<T>(relativeFilePath: string): T {
  const absolutePath = path.resolve(__dirname, relativeFilePath);
  const source = fs.readFileSync(absolutePath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: absolutePath,
  });

  const module = { exports: {} as Record<string, unknown> };
  const sandbox = {
    module,
    exports: module.exports,
    require,
    __filename: absolutePath,
    __dirname: path.dirname(absolutePath),
  };

  vm.runInNewContext(transpiled.outputText, sandbox, { filename: absolutePath });
  return module.exports as T;
}

const { hiraganaGroups } = loadMockModule<{ hiraganaGroups: any[] }>('../../src/services/mock/hiraganaData.ts');
const { katakanaGroups } = loadMockModule<{ katakanaGroups: any[] }>('../../src/services/mock/katakanaData.ts');
const { kanjiList } = loadMockModule<{ kanjiList: any[] }>('../../src/services/mock/kanjiData.ts');
const { dictionaryEntries } = loadMockModule<{ dictionaryEntries: any[] }>('../../src/services/mock/dictionaryData.ts');
const { mockLessons, mockPracticeSessions } = loadMockModule<{ mockLessons: any[]; mockPracticeSessions: any[] }>('../../src/services/mock/lessonData.ts');
const { mockUser, mockUserStats } = loadMockModule<{ mockUser: any; mockUserStats: any }>('../../src/services/mock/userData.ts');

const SAMPLE_USERS = [
  { name: 'Hiroshi', email: 'hiroshi@yomikai.ru', xp: 2450, streak: 14, weeklyXp: 2450 },
  { name: 'Sakura', email: 'sakura@yomikai.ru', xp: 1980, streak: 21, weeklyXp: 1980 },
  { name: 'Yuki', email: 'yuki@yomikai.ru', xp: 1650, streak: 5, weeklyXp: 1650 },
  { name: 'Kenji', email: 'kenji@yomikai.ru', xp: 1120, streak: 3, weeklyXp: 1120 },
  { name: 'Naomi', email: 'naomi@yomikai.ru', xp: 980, streak: 10, weeklyXp: 980 },
  { name: 'Takumi', email: 'takumi@yomikai.ru', xp: 850, streak: 0, weeklyXp: 850 },
  { name: 'Aimi', email: 'aimi@yomikai.ru', xp: 710, streak: 2, weeklyXp: 710 },
  { name: 'Rin', email: 'rin@yomikai.ru', xp: 580, streak: 6, weeklyXp: 580 },
  { name: 'Daiki', email: 'daiki@yomikai.ru', xp: 420, streak: 1, weeklyXp: 420 },
] as const;

function makeAvatarSeed(name: string): string {
  return `/avatar-default.svg`;
}

function buildAdminActivityLogs(userId: string) {
  const today = startOfDay(new Date());
  const minutesPattern = [
    ...Array.from({ length: 37 }, () => 43),
    34,
    ...mockUserStats.weeklyActivity.map((day) => day.minutes),
  ];

  const xpPattern = [
    ...Array.from({ length: 37 }, (_, index) => 20 + (index % 5) * 3),
    28,
    25,
    40,
    15,
    35,
    50,
    20,
    35,
  ];

  return minutesPattern.map((minutesSpent, index) => {
    const date = addDays(today, -(minutesPattern.length - 1 - index));
    return {
      userId,
      date,
      minutesSpent,
      xpGained: xpPattern[index] ?? 20,
    };
  });
}

async function clearDatabase() {
  await prisma.testAttempt.deleteMany();
  await prisma.userLessonProgress.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.leagueParticipant.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.testQuestion.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.practiceSession.deleteMany();
  await prisma.kanaChar.deleteMany();
  await prisma.kanaGroup.deleteMany();
  await prisma.vocabulary.deleteMany();
  await prisma.kanji.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.league.deleteMany();
  await prisma.user.deleteMany();
}

async function seedLeagues() {
  await prisma.league.createMany({
    data: [
      { name: 'Лига Академии', order: 1 },
      { name: 'Лига Храма Знаний', order: 2 },
      { name: 'Лига Додзё', order: 3 },
      { name: 'Лига Самураев', order: 4 },
      { name: 'Лига Сёгунов', order: 5 },
      { name: 'Лига Императора', order: 6 },
    ],
  });
}

async function seedAchievements() {
  await prisma.achievement.createMany({
    data: [
      {
        id: '1',
        title: 'Первые шаги',
        description: 'Выучи первые 5 символов хираганы',
        icon: 'footprints',
        maxProgress: 5,
        sortOrder: 1,
      },
      {
        id: '2',
        title: 'Неделя подряд',
        description: 'Занимайся 7 дней подряд',
        icon: 'flame',
        maxProgress: 7,
        sortOrder: 2,
      },
      {
        id: '3',
        title: 'Мастер хираганы',
        description: 'Выучи все 46 символов хираганы',
        icon: 'award',
        maxProgress: 46,
        sortOrder: 3,
      },
      {
        id: '4',
        title: 'Полиглот',
        description: 'Выучи 100 слов',
        icon: 'book-open',
        maxProgress: 100,
        sortOrder: 4,
      },
      {
        id: '5',
        title: 'Кандзи-новичок',
        description: 'Выучи первые 10 кандзи',
        icon: 'pen-tool',
        maxProgress: 10,
        sortOrder: 5,
      },
    ],
  });
}

async function seedKana() {
  const kanaGroups = [...hiraganaGroups, ...katakanaGroups];
  await prisma.kanaGroup.createMany({
    data: kanaGroups.map((group, index) => ({
      id: group.id,
      type: group.chars[0]?.type ?? 'hiragana',
      name: group.name,
      nameJp: group.nameJp,
      sortOrder: index,
    })),
  });

  const kanaChars = kanaGroups.flatMap((group, groupIndex) =>
    group.chars.map((char, charIndex) => ({
      id: char.id,
      groupId: group.id,
      char: char.char,
      romaji: char.romaji,
      type: char.type,
      groupCode: char.group,
      examples: char.examples,
      learned: char.learned,
      strokeOrder: char.strokeOrder ?? Prisma.DbNull,
      sortOrder: groupIndex * 100 + charIndex,
    })),
  );

  await prisma.kanaChar.createMany({
    data: kanaChars,
  });
}

async function seedDictionary() {
  await prisma.vocabulary.createMany({
    data: dictionaryEntries.map((entry, index) => ({
      id: entry.id,
      word: entry.word,
      reading: entry.reading,
      meaning: entry.meaning,
      partOfSpeech: entry.partOfSpeech,
      jlptLevel: entry.jlptLevel,
      examples: entry.examples,
      tags: entry.tags,
      sortOrder: index,
    })),
  });
}

async function seedKanji() {
  await prisma.kanji.createMany({
    data: kanjiList.map((item, index) => ({
      id: item.id,
      char: item.char,
      meaning: item.meaning,
      onyomi: item.onyomi,
      kunyomi: item.kunyomi,
      jlptLevel: item.jlptLevel,
      strokeCount: item.strokeCount,
      examples: item.examples,
      radical: item.radical,
      learned: item.learned,
      sortOrder: index,
    })),
  });
}

async function seedLessons() {
  await prisma.lesson.createMany({
    data: mockLessons.map((lesson, index) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      type: lesson.type,
      difficulty: lesson.difficulty,
      xpReward: lesson.xpReward,
      estimatedTime: lesson.estimatedTime,
      sortOrder: index,
    })),
  });

  const questions = mockLessons.flatMap((lesson) =>
    lesson.questions.map((question, index) => ({
      id: question.id,
      lessonId: lesson.id,
      type: question.type,
      question: question.question,
      options: question.options ?? Prisma.DbNull,
      correctAnswer: question.correctAnswer,
      hint: question.hint ?? null,
      explanation: question.explanation ?? null,
      sortOrder: index,
    })),
  );

  await prisma.testQuestion.createMany({
    data: questions,
  });
}

async function seedPracticeSessions() {
  await prisma.practiceSession.createMany({
    data: mockPracticeSessions.map((session, index) => ({
      id: session.id,
      type: session.type,
      title: session.title,
      description: session.description,
      icon: session.icon,
      itemCount: session.itemCount,
      completedCount: session.completedCount,
      accuracy: session.accuracy,
      sortOrder: index,
    })),
  });
}

async function seedUsers() {
  const academy = await prisma.league.findUnique({ where: { order: 1 } });
  if (!academy) {
    throw new Error('Academy league not found');
  }

  const adminPasswordHash = await bcrypt.hash('1234', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@yomikai.ru',
      passwordHash: adminPasswordHash,
      name: mockUser.name,
      avatar: mockUser.avatar,
      role: 'admin',
      xp: mockUser.xp,
      streak: mockUser.streak,
      longestStreak: mockUser.longestStreak,
      dailyGoal: mockUser.dailyGoal,
      joinedAt: new Date(mockUser.joinedAt),
      lastActiveDate: addDays(startOfDay(new Date()), -1),
      learnedKana: mockUser.learnedKana,
      learnedKanji: mockUser.learnedKanji,
      learnedWords: mockUser.learnedWords,
      recentLessons: mockUser.recentLessons.map((lesson, index) => ({
        ...lesson,
        lastAccessed: addDays(startOfDay(new Date()), -(index + 1)).toISOString(),
      })),
    },
  });

  await prisma.leagueParticipant.create({
    data: {
      userId: admin.id,
      leagueId: academy.id,
      weeklyXp: mockUser.xp,
    },
  });

  await prisma.userAchievement.createMany({
    data: mockUser.achievements.map((achievement) => ({
      userId: admin.id,
      achievementId: achievement.id,
      progress: achievement.progress,
      unlockedAt: new Date(achievement.unlockedAt),
    })),
  });

  await prisma.userLessonProgress.createMany({
    data: mockUser.recentLessons.slice(0, mockLessons.length).map((lesson, index) => ({
      userId: admin.id,
      lessonId: mockLessons[index].id,
      progress: lesson.progress,
      lastAccessed: addDays(startOfDay(new Date()), -(index + 1)),
      xpEarned: lesson.xpEarned,
      completedAt: lesson.progress >= 100 ? addDays(startOfDay(new Date()), -(index + 1)) : null,
    })),
  });

  await prisma.activityLog.createMany({
    data: buildAdminActivityLogs(admin.id),
  });

  await prisma.testAttempt.create({
    data: {
      userId: admin.id,
      lessonId: mockLessons[0].id,
      score: 87,
      totalQuestions: 100,
      correctAnswers: 87,
      timeSpent: 3600,
      completedAt: new Date(),
      answers: [],
      xpAwarded: 870,
    },
  });

  const samplePasswordHash = await bcrypt.hash('password123', 10);
  for (const sample of SAMPLE_USERS) {
    const user = await prisma.user.create({
      data: {
        email: sample.email,
        passwordHash: samplePasswordHash,
        name: sample.name,
        avatar: makeAvatarSeed(sample.name),
        role: 'user',
        xp: sample.xp,
        streak: sample.streak,
        longestStreak: Math.max(sample.streak, sample.streak + 2),
        dailyGoal: 50,
        joinedAt: addDays(startOfDay(new Date()), -(20 + SAMPLE_USERS.indexOf(sample))),
        lastActiveDate: null,
        learnedKana: 0,
        learnedKanji: 0,
        learnedWords: 0,
      },
    });

    await prisma.leagueParticipant.create({
      data: {
        userId: user.id,
        leagueId: academy.id,
        weeklyXp: sample.weeklyXp,
      },
    });
  }
}

async function main() {
  await clearDatabase();
  await ensureDefaultLeagues(prisma);
  await seedAchievements();
  await seedKana();
  await seedDictionary();
  await seedKanji();
  await seedLessons();
  await seedPracticeSessions();
  await seedUsers();

  const admin = await prisma.user.findUnique({ where: { email: 'admin@yomikai.ru' } });
  if (admin) {
    await syncAchievementProgress(prisma, admin.id);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
