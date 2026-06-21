"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = optionalAuth;
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const prisma_1 = require("../lib/prisma");
const http_1 = require("../lib/http");
const auth_service_1 = require("../services/auth.service");
function extractToken(req) {
    const header = req.header('authorization') ?? req.header('Authorization');
    if (!header?.startsWith('Bearer ')) {
        return null;
    }
    return header.slice('Bearer '.length).trim();
}
async function optionalAuth(req, _res, next) {
    const token = extractToken(req);
    if (!token) {
        next();
        return;
    }
    const user = await (0, auth_service_1.resolveAuthUser)(prisma_1.prisma, token);
    if (user) {
        req.authUser = user;
    }
    next();
}
async function requireAuth(req, _res, next) {
    const token = extractToken(req);
    if (!token) {
        next(new http_1.HttpError(401, 'Authentication required'));
        return;
    }
    const user = await (0, auth_service_1.resolveAuthUser)(prisma_1.prisma, token);
    if (!user) {
        next(new http_1.HttpError(401, 'Invalid or expired token'));
        return;
    }
    req.authUser = user;
    next();
}
function requireRole(role) {
    return (req, _res, next) => {
        if (!req.authUser) {
            next(new http_1.HttpError(401, 'Authentication required'));
            return;
        }
        if (req.authUser.role !== role) {
            next(new http_1.HttpError(403, 'Forbidden'));
            return;
        }
        next();
    };
}
