"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_service_1 = require("../services/auth.service");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
const authSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email(),
    password: zod_1.z.string().min(4),
});
const registerSchema = authSchema.extend({
    name: zod_1.z.string().trim().min(1),
});
router.post('/register', async (req, res, next) => {
    try {
        const body = registerSchema.parse(req.body);
        const result = await (0, auth_service_1.registerUser)(prisma_1.prisma, body);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
});
router.post('/login', async (req, res, next) => {
    try {
        const body = authSchema.parse(req.body);
        const result = await (0, auth_service_1.loginUser)(prisma_1.prisma, body);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
