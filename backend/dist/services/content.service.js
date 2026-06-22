"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKanaGroups = getKanaGroups;
exports.getKanjiList = getKanjiList;
exports.getDictionaryEntries = getDictionaryEntries;
exports.getLessonsForUser = getLessonsForUser;
exports.getLessonById = getLessonById;
exports.getPracticeSessions = getPracticeSessions;
exports.getLessonProgressSummary = getLessonProgressSummary;
exports.markKanaLearned = markKanaLearned;
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
        hint: item.hint ?? undefined,
        strokes: Array.isArray(item.strokes) ? item.strokes : undefined,
        words: Array.isArray(item.words) ? item.words : undefined,
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
async function markKanaLearned(client = prisma_1.prisma, kanaIds, userId, xpReward) {
    // Update the global kana learned state (since schema doesn't have UserKana table)
    await client.kanaChar.updateMany({
        where: { id: { in: kanaIds } },
        data: { learned: true },
    });
    if (userId) {
        // Increase learnedKana count on User
        await client.user.update({
            where: { id: userId },
            data: { learnedKana: { increment: kanaIds.length } },
        });
        if (xpReward && xpReward > 0) {
            // Lazy import grantXp to avoid circular dependencies
            const { grantXp } = await Promise.resolve().then(() => __importStar(require('./user.service')));
            await grantXp(client, userId, xpReward, { source: 'kana_study' });
        }
    }
    return { success: true };
}
