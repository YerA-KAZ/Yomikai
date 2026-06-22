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
router.post('/kana/learn', async (req, res, next) => {
    try {
        const { kanaIds, xpReward } = req.body;
        if (!Array.isArray(kanaIds)) {
            res.status(400).json({ error: 'kanaIds must be an array' });
            return;
        }
        // Dynamically import markKanaLearned since we didn't add it to imports yet
        const { markKanaLearned } = await Promise.resolve().then(() => __importStar(require('../services/content.service')));
        const data = await markKanaLearned(prisma_1.prisma, kanaIds, req.authUser?.id, xpReward);
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
router.post('/kanji/learn', async (req, res, next) => {
    try {
        const { kanjiId, xpReward } = req.body;
        if (!kanjiId) {
            res.status(400).json({ error: 'kanjiId is required' });
            return;
        }
        await prisma_1.prisma.kanji.update({
            where: { id: kanjiId },
            data: { learned: true },
        });
        if (req.authUser?.id && xpReward > 0) {
            const { grantXp } = await Promise.resolve().then(() => __importStar(require('../services/user.service')));
            await grantXp(prisma_1.prisma, req.authUser.id, xpReward, { source: 'kanji_study' });
        }
        res.json({ success: true });
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
