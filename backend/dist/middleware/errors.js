"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = notFound;
exports.errorHandler = errorHandler;
const http_1 = require("../lib/http");
function notFound(_req, res) {
    res.status(404).json({ message: 'Route not found' });
}
function errorHandler(err, _req, res, _next) {
    if (err instanceof http_1.HttpError) {
        res.status(err.status).json({ message: err.message });
        return;
    }
    if (err instanceof Error) {
        console.error(err);
        res.status(500).json({ message: err.message });
        return;
    }
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
}
