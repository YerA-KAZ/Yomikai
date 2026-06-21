"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWeeklyLeagueCron = startWeeklyLeagueCron;
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = require("../lib/prisma");
const league_service_1 = require("../services/league.service");
let scheduled = false;
function startWeeklyLeagueCron() {
    if (scheduled) {
        return;
    }
    scheduled = true;
    node_cron_1.default.schedule('59 23 * * 0', async () => {
        try {
            await (0, league_service_1.runWeeklyLeaguePromotion)(prisma_1.prisma);
            console.log('[cron] Weekly league promotion completed');
        }
        catch (error) {
            console.error('[cron] Weekly league promotion failed', error);
        }
    });
}
