"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKanaGroups = getKanaGroups;
exports.getKanjiList = getKanjiList;
exports.getDictionaryEntries = getDictionaryEntries;
exports.getLessonsForUser = getLessonsForUser;
exports.getLessonById = getLessonById;
exports.getPracticeSessions = getPracticeSessions;
exports.getLessonProgressSummary = getLessonProgressSummary;
const prisma_1 = require("../lib/prisma");
const http_1 = require("../lib/http");
function mapQuestion(question) {
    return {
        id: question.id,
        type: question.type,
        question: question.question,
        options: Array.isArray(question.options) ? question.options.map(String) : undefined,
        correctAnswer: question.correctAnswer,
        hint: question.hint ?? undefined,
        explanation: question.explanation ?? undefined,
    };
}
async function getKanaGroups(client = prisma_1.prisma, type) {
    const groups = await client.kanaGroup.findMany({
        where: { type },
        orderBy: { sortOrder: 'asc' },
        include: {
            chars: {
                orderBy: { sortOrder: 'asc' },
            },
        },
    });
    return groups.map((group) => ({
        id: group.id,
        name: group.name,
        nameJp: group.nameJp,
        chars: group.chars.map((char) => ({
            id: char.id,
            char: char.char,
            romaji: char.romaji,
            type: char.type,
            group: char.groupCode,
            examples: Array.isArray(char.examples) ? char.examples : [],
            learned: char.learned,
            strokeOrder: Array.isArray(char.strokeOrder) ? char.strokeOrder.map(String) : undefined,
        })),
    }));
}
async function getKanjiList(client = prisma_1.prisma, filters = {}) {
    const where = filters.level ? { jlptLevel: filters.level } : undefined;
    const items = await client.kanji.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
    });
    return items.map((item) => ({
        id: item.id,
        char: item.char,
        onyomi: Array.isArray(item.onyomi) ? item.onyomi.map(String) : [],
        kunyomi: Array.isArray(item.kunyomi) ? item.kunyomi.map(String) : [],
        meaning: item.meaning,
        jlptLevel: item.jlptLevel,
        strokeCount: item.strokeCount,
        examples: Array.isArray(item.examples) ? item.examples : [],
        radical: item.radical,
        learned: item.learned,
    }));
}
async function getDictionaryEntries(client = prisma_1.prisma, filters = {}) {
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
        jlptLevel: item.jlptLevel,
        examples: Array.isArray(item.examples) ? item.examples : [],
        tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
    }));
}
async function getLessonsForUser(client = prisma_1.prisma, userId) {
    const lessons = await client.lesson.findMany({
        orderBy: { sortOrder: 'asc' },
        include: {
            questions: {
                orderBy: { sortOrder: 'asc' },
            },
        },
    });
    const completedMap = new Map();
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
        type: lesson.type,
        difficulty: lesson.difficulty,
        xpReward: lesson.xpReward,
        estimatedTime: lesson.estimatedTime,
        completed: completedMap.get(lesson.id) ?? false,
        questions: lesson.questions.map(mapQuestion),
    }));
}
async function getLessonById(client = prisma_1.prisma, lessonId, userId) {
    const lesson = await client.lesson.findUnique({
        where: { id: lessonId },
        include: {
            questions: {
                orderBy: { sortOrder: 'asc' },
            },
        },
    });
    if (!lesson) {
        throw new http_1.HttpError(404, 'Lesson not found');
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
        type: lesson.type,
        difficulty: lesson.difficulty,
        xpReward: lesson.xpReward,
        estimatedTime: lesson.estimatedTime,
        completed,
        questions: lesson.questions.map(mapQuestion),
    };
}
async function getPracticeSessions(client = prisma_1.prisma) {
    const sessions = await client.practiceSession.findMany({
        orderBy: { sortOrder: 'asc' },
    });
    return sessions.map((session) => ({
        id: session.id,
        type: session.type,
        title: session.title,
        description: session.description,
        icon: session.icon,
        itemCount: session.itemCount,
        completedCount: session.completedCount,
        accuracy: session.accuracy,
    }));
}
async function getLessonProgressSummary(client = prisma_1.prisma, lessonId, userId) {
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
