"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const league_service_1 = require("../services/league.service");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.get('/', async (req, res, next) => {
    try {
        const scope = typeof req.query.scope === 'string' ? req.query.scope : 'weekly';
        const data = scope === 'all-time' || scope === 'alltime'
            ? await (0, league_service_1.getAllTimeLeaderboard)(req.authUser.id, prisma_1.prisma)
            : await (0, league_service_1.getLeaderboardForUser)(req.authUser.id, prisma_1.prisma);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
