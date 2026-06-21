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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.resolveAuthUser = resolveAuthUser;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../lib/prisma");
const http_1 = require("../lib/http");
const jwt_1 = require("../lib/jwt");
const user_service_1 = require("./user.service");
const league_service_1 = require("./league.service");
async function registerUser(client = prisma_1.prisma, input) {
    const existing = await client.user.findUnique({
        where: { email: input.email.toLowerCase() },
    });
    if (existing) {
        throw new http_1.HttpError(409, 'User already exists');
    }
    const passwordHash = await bcrypt_1.default.hash(input.password, 10);
    const user = await client.user.create({
        data: {
            email: input.email.toLowerCase(),
            passwordHash,
            name: input.name,
        },
    });
    await (0, user_service_1.ensureUserAchievementRows)(client, user.id);
    await (0, league_service_1.ensureUserLeagueParticipant)(user.id, client);
    const profile = await (0, user_service_1.buildUserProfile)(client, user.id);
    return {
        token: (0, jwt_1.signToken)(user.id, user.role),
        user: {
            ...profile,
            role: user.role,
        },
    };
}
async function loginUser(client = prisma_1.prisma, input) {
    const user = await client.user.findUnique({
        where: { email: input.email.toLowerCase() },
    });
    if (!user) {
        throw new http_1.HttpError(401, 'Invalid email or password');
    }
    const passwordMatches = await bcrypt_1.default.compare(input.password, user.passwordHash);
    if (!passwordMatches) {
        throw new http_1.HttpError(401, 'Invalid email or password');
    }
    const profile = await (0, user_service_1.buildUserProfile)(client, user.id);
    return {
        token: (0, jwt_1.signToken)(user.id, user.role),
        user: {
            ...profile,
            role: user.role,
        },
    };
}
async function resolveAuthUser(client = prisma_1.prisma, token) {
    if ((0, jwt_1.isMockAuthToken)(token)) {
        return client.user.findUnique({
            where: { email: 'admin@yomikai.ru' },
        });
    }
    try {
        const { verifyToken } = await Promise.resolve().then(() => __importStar(require('../lib/jwt')));
        const payload = verifyToken(token);
        return client.user.findUnique({
            where: { id: payload.sub },
        });
    }
    catch {
        return null;
    }
}
