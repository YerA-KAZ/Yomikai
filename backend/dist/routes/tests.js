"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const test_service_1 = require("../services/test.service");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
const answersSchema = zod_1.z.object({
    questionId: zod_1.z.string().min(1),
    userAnswer: zod_1.z.string(),
    correct: zod_1.z.boolean(),
});
const submitSchema = zod_1.z.object({
    testId: zod_1.z.string().min(1),
    score: zod_1.z.number().int().nonnegative(),
    totalQuestions: zod_1.z.number().int().positive(),
    correctAnswers: zod_1.z.number().int().nonnegative(),
    timeSpent: zod_1.z.number().int().nonnegative(),
    completedAt: zod_1.z.string().datetime(),
    answers: zod_1.z.array(answersSchema),
});
router.post('/submit', async (req, res, next) => {
    try {
        const body = submitSchema.parse(req.body);
        const result = await (0, test_service_1.submitTestResult)(prisma_1.prisma, req.authUser.id, body);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
