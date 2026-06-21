"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startOfDay = startOfDay;
exports.endOfDay = endOfDay;
exports.addDays = addDays;
exports.isSameDay = isSameDay;
exports.isYesterday = isYesterday;
exports.dayLabel = dayLabel;
exports.weekDatesEndingToday = weekDatesEndingToday;
exports.monthDaysAgo = monthDaysAgo;
const DAY_NAMES = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
function startOfDay(date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
}
function endOfDay(date) {
    const result = startOfDay(date);
    result.setHours(23, 59, 59, 999);
    return result;
}
function addDays(date, offset) {
    const result = startOfDay(date);
    result.setDate(result.getDate() + offset);
    return result;
}
function isSameDay(left, right) {
    if (!left || !right)
        return false;
    return startOfDay(left).getTime() === startOfDay(right).getTime();
}
function isYesterday(target, reference) {
    if (!target)
        return false;
    return startOfDay(target).getTime() === addDays(reference, -1).getTime();
}
function dayLabel(date) {
    return DAY_NAMES[date.getDay()];
}
function weekDatesEndingToday(today = new Date()) {
    return Array.from({ length: 7 }, (_, index) => addDays(today, index - 6));
}
function monthDaysAgo(days, from = new Date()) {
    return Array.from({ length: days }, (_, index) => addDays(from, -index));
}
