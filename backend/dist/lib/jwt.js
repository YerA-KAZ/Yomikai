"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
exports.isMockAuthToken = isMockAuthToken;
exports.getMockUserId = getMockUserId;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("./env");
const MOCK_USER_ID = 'mock-admin-user';
function signToken(userId, role) {
    return jsonwebtoken_1.default.sign({ sub: userId, role }, env_1.env.jwtSecret, {
        expiresIn: '7d',
    });
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
}
function isMockAuthToken(token) {
    return token === env_1.env.mockAuthToken;
}
function getMockUserId() {
    return MOCK_USER_ID;
}
