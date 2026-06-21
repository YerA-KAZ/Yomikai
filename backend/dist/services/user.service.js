"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureUserAchievementRows = ensureUserAchievementRows;
exports.syncAchievementProgress = syncAchievementProgress;
exports.buildUserProfile = buildUserProfile;
exports.buildUserStats = buildUserStats;
exports.updateUserProfile = updateUserProfile;
exports.grantXp = grantXp;
exports.grantXpInTransaction = grantXpInTransaction;
exports.resetUserXp = resetUserXp;
exports.deleteUser = deleteUser;
exports.listUsersForAdmin = listUsersForAdmin;
const http_1 = require("../lib/http");
const dates_1 = require("../lib/dates");
const level_1 = require("./level");
const league_service_1 = require("./league.service");
const ACHIEVEMENT_PROGRESS_RULES = {
    'Первые шаги': (user) => Math.min(user.learnedKana, 5),
    'Неделя подряд': (user) => user.streak,
    'Мастер хираганы': (user) => user.learnedKana,
    'Полиглот': (user) => user.learnedWords,
    'Кандзи-новичок': (user) => user.learnedKanji,
};
async function fetchUserOrThrow(client, userId) {
    const user = await client.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new http_1.HttpError(404, 'User not found');
    }
    return user;
}
async function ensureUserAchievementRows(client, userId) {
    const achievements = await client.achievement.findMany({
        orderBy: { sortOrder: 'asc' },
    });
    if (achievements.length === 0) {
        return;
    }
    const existing = await client.userAchievement.findMany({
        where: { userId },
        select: { achievementId: true },
    });
    const existingIds = new Set(existing.map((item) => item.achievementId));
    const missing = achievements.filter((achievement) => !existingIds.has(achievement.id));
    if (missing.length === 0) {
        return;
    }
    await client.userAchievement.createMany({
        data: missing.map((achievement) => ({
            userId,
            achievementId: achievement.id,
            progress: 0,
            unlockedAt: null,
        })),
        skipDuplicates: true,
    });
}
async function syncAchievementProgress(client, userId) {
    const user = await fetchUserOrThrow(client, userId);
    const achievements = await client.achievement.findMany({
        orderBy: { sortOrder: 'asc' },
    });
    for (const achievement of achievements) {
        const computeProgress = ACHIEVEMENT_PROGRESS_RULES[achievement.title] ?? (() => 0);
        const progress = Math.max(0, Math.min(computeProgress(user), achievement.maxProgress));
        const existing = await client.userAchievement.findUnique({
            where: {
                userId_achievementId: {
                    userId,
                    achievementId: achievement.id,
                },
            },
        });
        const unlockedAt = progress >= achievement.maxProgress
            ? existing?.unlockedAt ?? new Date()
            : existing?.unlockedAt ?? null;
        await client.userAchievement.upsert({
            where: {
                userId_achievementId: {
                    userId,
                    achievementId: achievement.id,
                },
            },
            create: {
                userId,
                achievementId: achievement.id,
                progress,
                unlockedAt: progress >= achievement.maxProgress ? unlockedAt : null,
            },
            update: {
                progress,
                unlockedAt: progress >= achievement.maxProgress ? unlockedAt : existing?.unlockedAt ?? null,
            },
        });
    }
}
function mapAchievements(achievements) {
    return achievements
        .sort((left, right) => left.achievement.sortOrder - right.achievement.sortOrder)
        .map((item) => ({
        id: item.achievement.id,
        title: item.achievement.title,
        description: item.achievement.description,
        icon: item.achievement.icon,
        unlockedAt: item.unlockedAt?.toISOString() ?? '',
        progress: item.progress,
        maxProgress: item.achievement.maxProgress,
    }));
}
function mapRecentLessons(progressItems) {
    return progressItems
        .sort((left, right) => right.lastAccessed.getTime() - left.lastAccessed.getTime())
        .map((item) => ({
        id: item.lesson.id,
        title: item.lesson.title,
        type: item.lesson.type,
        progress: item.progress,
        lastAccessed: item.lastAccessed.toISOString(),
        xpEarned: item.xpEarned,
    }));
}
async function buildUserProfile(client, userId) {
    await ensureUserAchievementRows(client, userId);
    await syncAchievementProgress(client, userId);
    const user = await fetchUserOrThrow(client, userId);
    const today = (0, dates_1.startOfDay)(new Date());
    const [achievements, activityLogs, lessonProgress,] = await Promise.all([
        client.userAchievement.findMany({
            where: { userId },
            include: {
                achievement: true,
            },
        }),
        client.activityLog.findMany({
            where: { userId },
            orderBy: { date: 'asc' },
        }),
        client.userLessonProgress.findMany({
            where: { userId },
            orderBy: { lastAccessed: 'desc' },
            take: 4,
            include: {
                lesson: true,
            },
        }),
    ]);
    const dailyXp = activityLogs.find((log) => (0, dates_1.isSameDay)(log.date, today))?.xpGained ?? 0;
    const totalStudyTime = activityLogs.reduce((sum, log) => sum + log.minutesSpent, 0);
    const storedRecentLessons = Array.isArray(user.recentLessons)
        ? user.recentLessons
        : null;
    const recentLessons = storedRecentLessons && storedRecentLessons.length > 0
        ? storedRecentLessons
            .map((entry) => ({
            id: String(entry.id ?? ''),
            title: String(entry.title ?? ''),
            type: String(entry.type ?? 'practice'),
            progress: Number(entry.progress ?? 0),
            lastAccessed: String(entry.lastAccessed ?? new Date().toISOString()),
            xpEarned: Number(entry.xpEarned ?? 0),
        }))
        : mapRecentLessons(lessonProgress);
    return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        level: (0, level_1.getLevelInfo)(user.xp).level,
        xp: user.xp,
        xpToNextLevel: (0, level_1.getLevelInfo)(user.xp).xpToNextLevel,
        streak: user.streak,
        longestStreak: user.longestStreak,
        dailyGoal: user.dailyGoal,
        dailyXp,
        joinedAt: user.joinedAt.toISOString(),
        totalStudyTime,
        learnedKana: user.learnedKana,
        learnedKanji: user.learnedKanji,
        learnedWords: user.learnedWords,
        achievements: mapAchievements(achievements),
        recentLessons,
    };
}
async function buildUserStats(client, userId) {
    const user = await fetchUserOrThrow(client, userId);
    const activityLogs = await client.activityLog.findMany({
        where: { userId },
        orderBy: { date: 'asc' },
    });
    const attempts = await client.testAttempt.findMany({
        where: { userId },
    });
    const totalCorrect = attempts.reduce((sum, attempt) => sum + attempt.correctAnswers, 0);
    const totalQuestions = attempts.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const totalStudyTime = activityLogs.reduce((sum, log) => sum + log.minutesSpent, 0);
    const studyDays = activityLogs.filter((log) => log.minutesSpent > 0 || log.xpGained > 0).length;
    const weeklyActivity = (0, dates_1.weekDatesEndingToday)(new Date()).map((date) => {
        const log = activityLogs.find((entry) => (0, dates_1.isSameDay)(entry.date, date));
        return {
            day: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][date.getDay()],
            minutes: log?.minutesSpent ?? 0,
        };
    });
    return {
        totalXp: user.xp,
        studyDays,
        accuracy,
        wordsLearned: user.learnedWords,
        kanjiLearned: user.learnedKanji,
        kanaLearned: user.learnedKana,
        totalStudyTime,
        weeklyActivity,
    };
}
async function updateUserProfile(client, userId, input) {
    const data = {};
    if (typeof input.name === 'string') {
        data.name = input.name;
    }
    if (typeof input.avatar === 'string') {
        data.avatar = input.avatar;
    }
    if (typeof input.dailyGoal === 'number' && Number.isFinite(input.dailyGoal)) {
        data.dailyGoal = input.dailyGoal;
    }
    if (typeof input.learnedKana === 'number' && Number.isFinite(input.learnedKana)) {
        data.learnedKana = input.learnedKana;
    }
    if (typeof input.learnedKanji === 'number' && Number.isFinite(input.learnedKanji)) {
        data.learnedKanji = input.learnedKanji;
    }
    if (typeof input.learnedWords === 'number' && Number.isFinite(input.learnedWords)) {
        data.learnedWords = input.learnedWords;
    }
    if (Object.keys(data).length === 0) {
        return buildUserProfile(client, userId);
    }
    await client.user.update({
        where: { id: userId },
        data,
    });
    await syncAchievementProgress(client, userId);
    return buildUserProfile(client, userId);
}
async function grantXp(client, userId, amount, options) {
    if ('$transaction' in client) {
        await client.$transaction(async (tx) => {
            await grantXpInTransaction(tx, userId, amount, options);
        });
        return buildUserProfile(client, userId);
    }
    await grantXpInTransaction(client, userId, amount, options);
    return buildUserProfile(client, userId);
}
async function grantXpInTransaction(client, userId, amount, options) {
    if (amount <= 0) {
        throw new http_1.HttpError(400, 'XP amount must be positive');
    }
    const user = await fetchUserOrThrow(client, userId);
    await (0, league_service_1.ensureUserLeagueParticipant)(userId, client);
    const today = (0, dates_1.startOfDay)(new Date());
    const existingLog = await client.activityLog.findUnique({
        where: {
            userId_date: {
                userId,
                date: today,
            },
        },
    });
    const previousDailyXp = existingLog?.xpGained ?? 0;
    const nextDailyXp = previousDailyXp + amount;
    const reachedGoalNow = previousDailyXp < user.dailyGoal && nextDailyXp >= user.dailyGoal;
    const logCreateData = {
        user: {
            connect: { id: userId },
        },
        date: today,
        xpGained: amount,
        minutesSpent: options.minutesSpent ?? 0,
    };
    const logUpdateData = {
        xpGained: { increment: amount },
    };
    if ((options.minutesSpent ?? 0) > 0) {
        logUpdateData.minutesSpent = {
            increment: options.minutesSpent ?? 0,
        };
    }
    if (existingLog) {
        await client.activityLog.update({
            where: {
                userId_date: {
                    userId,
                    date: today,
                },
            },
            data: logUpdateData,
        });
    }
    else {
        await client.activityLog.create({
            data: logCreateData,
        });
    }
    const userUpdateData = {
        xp: { increment: amount },
    };
    if (reachedGoalNow && !(0, dates_1.isSameDay)(user.lastActiveDate, today)) {
        const nextStreak = (0, dates_1.isYesterday)(user.lastActiveDate, today) ? user.streak + 1 : 1;
        userUpdateData.streak = nextStreak;
        userUpdateData.longestStreak = Math.max(user.longestStreak, nextStreak);
        userUpdateData.lastActiveDate = today;
    }
    await client.user.update({
        where: { id: userId },
        data: userUpdateData,
    });
    await (0, league_service_1.incrementWeeklyXp)(userId, amount, client);
    await syncAchievementProgress(client, userId);
}
async function resetUserXp(client, userId) {
    await client.user.update({
        where: { id: userId },
        data: {
            xp: 0,
            streak: 0,
            longestStreak: 0,
            lastActiveDate: null,
        },
    });
    await client.leagueParticipant.updateMany({
        where: { userId },
        data: { weeklyXp: 0 },
    });
    await syncAchievementProgress(client, userId);
    return buildUserProfile(client, userId);
}
async function deleteUser(client, userId) {
    await client.user.delete({
        where: { id: userId },
    });
}
async function listUsersForAdmin(client) {
    const users = await client.user.findMany({
        orderBy: { joinedAt: 'asc' },
        include: {
            leagueParticipant: {
                include: {
                    league: true,
                },
            },
        },
    });
    return users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        xp: user.xp,
        level: (0, level_1.getLevelInfo)(user.xp).level,
        streak: user.streak,
        longestStreak: user.longestStreak,
        league: user.leagueParticipant?.league.name ?? null,
        weeklyXp: user.leagueParticipant?.weeklyXp ?? 0,
        joinedAt: user.joinedAt.toISOString(),
    }));
}
