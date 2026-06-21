"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const content_service_1 = require("../services/content.service");
const router = (0, express_1.Router)();
router.use(auth_1.optionalAuth);
router.get('/kana/hiragana', async (_req, res, next) => {
    try {
        const data = await (0, content_service_1.getKanaGroups)(prisma_1.prisma, 'hiragana');
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
router.get('/kana/katakana', async (_req, res, next) => {
    try {
        const data = await (0, content_service_1.getKanaGroups)(prisma_1.prisma, 'katakana');
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
router.get('/kanji', async (req, res, next) => {
    try {
        const level = typeof req.query.level === 'string' ? req.query.level : undefined;
        const data = await (0, content_service_1.getKanjiList)(prisma_1.prisma, { level });
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
router.get('/dictionary', async (req, res, next) => {
    try {
        const jlpt = typeof req.query.jlpt === 'string' ? req.query.jlpt : undefined;
        const search = typeof req.query.search === 'string' ? req.query.search : undefined;
        const q = typeof req.query.q === 'string' ? req.query.q : undefined;
        const data = await (0, content_service_1.getDictionaryEntries)(prisma_1.prisma, { jlpt, search, q });
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
router.get('/lessons', async (req, res, next) => {
    try {
        const data = await (0, content_service_1.getLessonsForUser)(prisma_1.prisma, req.authUser?.id);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
router.get('/lessons/:id', async (req, res, next) => {
    try {
        const data = await (0, content_service_1.getLessonById)(prisma_1.prisma, req.params.id, req.authUser?.id);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
router.get('/practice', async (_req, res, next) => {
    try {
        const data = await (0, content_service_1.getPracticeSessions)(prisma_1.prisma);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
