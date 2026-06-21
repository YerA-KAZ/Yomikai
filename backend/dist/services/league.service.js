"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDefaultLeagues = ensureDefaultLeagues;
exports.getLeagueByOrder = getLeagueByOrder;
exports.ensureUserLeagueParticipant = ensureUserLeagueParticipant;
exports.getCurrentLeagueForUser = getCurrentLeagueForUser;
exports.getLeaderboardForUser = getLeaderboardForUser;
exports.getAllTimeLeaderboard = getAllTimeLeaderboard;
exports.incrementWeeklyXp = incrementWeeklyXp;
exports.resetWeeklyXp = resetWeeklyXp;
exports.runWeeklyLeaguePromotion = runWeeklyLeaguePromotion;
const prisma_1 = require("../lib/prisma");
const level_1 = require("./level");
const http_1 = require("../lib/http");
function mapLeaderboardEntries(items, currentUserId) {
    return items.map((item, index) => {
        const level = (0, level_1.getLevelInfo)(item.user.xp).level;
        return {
            rank: index + 1,
            id: item.user.id,
            name: item.user.name,
            avatar: item.user.avatar,
            level,
            xp: item.user.xp,
            streak: item.user.streak,
            weeklyXp: item.weeklyXp,
            isCurrentUser: item.user.id === currentUserId,
        };
    });
}
async function ensureDefaultLeagues(client = prisma_1.prisma) {
    const existing = await client.league.count();
    if (existing > 0) {
        return;
    }
    await client.league.createMany({
        data: [
            { name: 'Лига Академии', order: 1 },
            { name: 'Лига Храма Знаний', order: 2 },
            { name: 'Лига Додзё', order: 3 },
            { name: 'Лига Самураев', order: 4 },
            { name: 'Лига Сёгунов', order: 5 },
            { name: 'Лига Императора', order: 6 },
        ],
    });
}
async function getLeagueByOrder(order, client = prisma_1.prisma) {
    const league = await client.league.findUnique({ where: { order } });
    if (!league) {
        throw new http_1.HttpError(500, `League with order ${order} not found`);
    }
    return league;
}
async function ensureUserLeagueParticipant(userId, client = prisma_1.prisma) {
    const existing = await client.leagueParticipant.findUnique({
        where: { userId },
        include: { league: true },
    });
    if (existing) {
        return existing;
    }
    const academy = await getLeagueByOrder(1, client);
    return client.leagueParticipant.create({
        data: {
            userId,
            leagueId: academy.id,
        },
        include: { league: true },
    });
}
async function getCurrentLeagueForUser(userId, client = prisma_1.prisma) {
    return ensureUserLeagueParticipant(userId, client);
}
function sortParticipants(participants) {
    return [...participants].sort((left, right) => {
        if (right.weeklyXp !== left.weeklyXp) {
            return right.weeklyXp - left.weeklyXp;
        }
        if (right.user.xp !== left.user.xp) {
            return right.user.xp - left.user.xp;
        }
        return left.user.name.localeCompare(right.user.name);
    });
}
async function getLeaderboardForUser(userId, client = prisma_1.prisma) {
    const participant = await ensureUserLeagueParticipant(userId, client);
    const league = await client.league.findUnique({
        where: { id: participant.leagueId },
    });
    if (!league) {
        throw new http_1.HttpError(404, 'League not found');
    }
    const participants = await client.leagueParticipant.findMany({
        where: { leagueId: league.id },
        include: { user: true },
    });
    const entries = mapLeaderboardEntries(sortParticipants(participants).map((item) => ({
        user: item.user,
        weeklyXp: item.weeklyXp,
    })), userId);
    return {
        league: {
            id: league.id,
            name: league.name,
            order: league.order,
        },
        entries,
    };
}
async function getAllTimeLeaderboard(userId, client = prisma_1.prisma) {
    await ensureUserLeagueParticipant(userId, client);
    const [users, participants] = await Promise.all([
        client.user.findMany({
            orderBy: [
                { xp: 'desc' },
                { streak: 'desc' },
                { name: 'asc' },
            ],
        }),
        client.leagueParticipant.findMany({
            select: {
                userId: true,
                weeklyXp: true,
            },
        }),
    ]);
    const weeklyXpByUserId = new Map(participants.map((item) => [item.userId, item.weeklyXp]));
    return {
        league: {
            id: 'all-time',
            name: 'Рейтинг за все время',
            order: 0,
        },
        entries: mapLeaderboardEntries(users.map((user) => ({
            user,
            weeklyXp: weeklyXpByUserId.get(user.id) ?? 0,
        })), userId),
    };
}
async function incrementWeeklyXp(userId, amount, client = prisma_1.prisma) {
    const participant = await ensureUserLeagueParticipant(userId, client);
    await client.leagueParticipant.update({
        where: { id: participant.id },
        data: { weeklyXp: { increment: amount } },
    });
}
async function resetWeeklyXp(client = prisma_1.prisma) {
    await client.leagueParticipant.updateMany({
        data: { weeklyXp: 0 },
    });
}
async function runWeeklyLeaguePromotion(client = prisma_1.prisma) {
    const leagues = await client.league.findMany({
        orderBy: { order: 'asc' },
        include: {
            participants: {
                include: { user: true },
            },
        },
    });
    if (leagues.length === 0) {
        return;
    }
    const promotions = [];
    for (let index = 0; index < leagues.length - 1; index += 1) {
        const currentLeague = leagues[index];
        const nextLeague = leagues[index + 1];
        const topParticipants = sortParticipants(currentLeague.participants).slice(0, 3);
        for (const participant of topParticipants) {
            promotions.push({
                participantId: participant.id,
                targetLeagueId: nextLeague.id,
            });
        }
    }
    await client.$transaction(async (tx) => {
        for (const promotion of promotions) {
            await tx.leagueParticipant.update({
                where: { id: promotion.participantId },
                data: { leagueId: promotion.targetLeagueId },
            });
        }
        await tx.leagueParticipant.updateMany({
            data: { weeklyXp: 0 },
        });
    });
}
