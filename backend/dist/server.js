"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./lib/env");
const league_service_1 = require("./services/league.service");
const weeklyLeagueCron_1 = require("./jobs/weeklyLeagueCron");
async function bootstrap() {
    await (0, league_service_1.ensureDefaultLeagues)();
    (0, weeklyLeagueCron_1.startWeeklyLeagueCron)();
    app_1.default.listen(env_1.env.port, () => {
        console.log(`Yomikai backend listening on http://localhost:${env_1.env.port}`);
    });
}
bootstrap().catch((error) => {
    console.error('Failed to start backend', error);
    process.exit(1);
});
