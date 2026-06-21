"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function required(name, fallback) {
    const value = process.env[name] ?? fallback;
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
exports.env = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 3001),
    databaseUrl: required('DATABASE_URL'),
    jwtSecret: required('JWT_SECRET', 'development-secret'),
    frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
    mockAuthToken: process.env.MOCK_AUTH_TOKEN ?? 'mock_jwt_token_12345',
};
