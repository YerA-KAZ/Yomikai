"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const user_service_1 = require("../services/user.service");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.use((0, auth_1.requireRole)('admin'));
const dictionarySchema = zod_1.z.object({
    word: zod_1.z.string().min(1),
    reading: zod_1.z.string().min(1),
    meaning: zod_1.z.string().min(1),
    partOfSpeech: zod_1.z.string().min(1),
    jlptLevel: zod_1.z.enum(['N5', 'N4', 'N3', 'N2', 'N1']),
    examples: zod_1.z.array(zod_1.z.object({
        japanese: zod_1.z.string(),
        russian: zod_1.z.string(),
    })).default([]),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
});
const kanjiSchema = zod_1.z.object({
    char: zod_1.z.string().min(1),
    meaning: zod_1.z.string().min(1),
    onyomi: zod_1.z.array(zod_1.z.string()).default([]),
    kunyomi: zod_1.z.array(zod_1.z.string()).default([]),
    jlptLevel: zod_1.z.enum(['N5', 'N4', 'N3', 'N2', 'N1']),
    strokeCount: zod_1.z.number().int().positive(),
    examples: zod_1.z.array(zod_1.z.object({
        word: zod_1.z.string(),
        reading: zod_1.z.string(),
        meaning: zod_1.z.string(),
    })).default([]),
    radical: zod_1.z.string().min(1),
    learned: zod_1.z.boolean().optional(),
});
const testSchema = zod_1.z.object({
    lessonId: zod_1.z.string().min(1),
    type: zod_1.z.enum(['multiple_choice', 'typing', 'matching', 'listening']),
    question: zod_1.z.string().min(1),
    options: zod_1.z.array(zod_1.z.string()).optional(),
    correctAnswer: zod_1.z.string().min(1),
    hint: zod_1.z.string().optional(),
    explanation: zod_1.z.string().optional(),
});
router.get('/users', async (_req, res, next) => {
    try {
        const users = await (0, user_service_1.listUsersForAdmin)(prisma_1.prisma);
        res.json(users);
    }
    catch (error) {
        next(error);
    }
});
router.post('/dictionary', async (req, res, next) => {
    try {
        const body = dictionarySchema.parse(req.body);
        const item = await prisma_1.prisma.vocabulary.create({
            data: {
                ...body,
                sortOrder: await prisma_1.prisma.vocabulary.count(),
            },
        });
        res.status(201).json(item);
    }
    catch (error) {
        next(error);
    }
});
router.post('/kanji', async (req, res, next) => {
    try {
        const body = kanjiSchema.parse(req.body);
        const item = await prisma_1.prisma.kanji.create({
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
                sortOrder: await prisma_1.prisma.kanji.count(),
            },
        });
        res.status(201).json(item);
    }
    catch (error) {
        next(error);
    }
});
router.post('/tests', async (req, res, next) => {
    try {
        const body = testSchema.parse(req.body);
        const lesson = await prisma_1.prisma.lesson.findUnique({
            where: { id: body.lessonId },
        });
        if (!lesson) {
            res.status(404).json({ message: 'Lesson not found' });
            return;
        }
        const question = await prisma_1.prisma.testQuestion.create({
            data: {
                lessonId: body.lessonId,
                type: body.type,
                question: body.question,
                options: body.options,
                correctAnswer: body.correctAnswer,
                hint: body.hint,
                explanation: body.explanation,
                sortOrder: await prisma_1.prisma.testQuestion.count({
                    where: { lessonId: body.lessonId },
                }),
            },
        });
        res.status(201).json(question);
    }
    catch (error) {
        next(error);
    }
});
router.post('/users/:id/reset', async (req, res, next) => {
    try {
        const user = await (0, user_service_1.resetUserXp)(prisma_1.prisma, req.params.id);
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/users/:id', async (req, res, next) => {
    try {
        await (0, user_service_1.deleteUser)(prisma_1.prisma, req.params.id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
