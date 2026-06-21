"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const content_1 = __importDefault(require("./routes/content"));
const leaderboard_1 = __importDefault(require("./routes/leaderboard"));
const tests_1 = __importDefault(require("./routes/tests"));
const admin_1 = __importDefault(require("./routes/admin"));
const env_1 = require("./lib/env");
const errors_1 = require("./middleware/errors");
exports.app = (0, express_1.default)();
exports.app.disable('x-powered-by');
exports.app.use((0, cors_1.default)({
    origin: env_1.env.frontendOrigin,
    credentials: true,
}));
exports.app.use(express_1.default.json({ limit: '2mb' }));
exports.app.get('/health', (_req, res) => {
    res.json({ ok: true });
});
exports.app.use('/api/auth', auth_1.default);
exports.app.use('/api/user', user_1.default);
exports.app.use('/api/users', user_1.default);
exports.app.use('/api', content_1.default);
exports.app.use('/api/leaderboard', leaderboard_1.default);
exports.app.use('/api/tests', tests_1.default);
exports.app.use('/api/admin', admin_1.default);
exports.app.use(errors_1.notFound);
exports.app.use(errors_1.errorHandler);
exports.default = exports.app;
