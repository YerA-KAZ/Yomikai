"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const user_service_1 = require("../services/user.service");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
const xpSchema = zod_1.z.object({
    amount: zod_1.z.number().int().positive(),
    source: zod_1.z.string().min(1),
    minutesSpent: zod_1.z.number().int().nonnegative().optional(),
});
const updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).optional(),
    avatar: zod_1.z.string().min(1).optional(),
    dailyGoal: zod_1.z.number().int().positive().optional(),
    learnedKana: zod_1.z.number().int().nonnegative().optional(),
    learnedKanji: zod_1.z.number().int().nonnegative().optional(),
    learnedWords: zod_1.z.number().int().nonnegative().optional(),
});
router.get('/me', async (req, res, next) => {
    try {
        const user = await (0, user_service_1.buildUserProfile)(prisma_1.prisma, req.authUser.id);
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
router.get('/stats', async (req, res, next) => {
    try {
        const stats = await (0, user_service_1.buildUserStats)(prisma_1.prisma, req.authUser.id);
        res.json(stats);
    }
    catch (error) {
        next(error);
    }
});
router.get('/me/activity', async (req, res, next) => {
    try {
        const stats = await (0, user_service_1.buildUserStats)(prisma_1.prisma, req.authUser.id);
        res.json(stats.weeklyActivity);
    }
    catch (error) {
        next(error);
    }
});
router.post('/me/xp', async (req, res, next) => {
    try {
        const body = xpSchema.parse(req.body);
        const user = await (0, user_service_1.grantXp)(prisma_1.prisma, req.authUser.id, body.amount, {
            source: body.source,
            minutesSpent: body.minutesSpent,
        });
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
router.post('/me', async (req, res, next) => {
    try {
        const body = updateProfileSchema.parse(req.body);
        const user = await (0, user_service_1.updateUserProfile)(prisma_1.prisma, req.authUser.id, body);
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
