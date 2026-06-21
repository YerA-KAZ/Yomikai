const DAY_NAMES = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function endOfDay(date: Date): Date {
  const result = startOfDay(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

export function addDays(date: Date, offset: number): Date {
  const result = startOfDay(date);
  result.setDate(result.getDate() + offset);
  return result;
}

export function isSameDay(left: Date | null | undefined, right: Date | null | undefined): boolean {
  if (!left || !right) return false;
  return startOfDay(left).getTime() === startOfDay(right).getTime();
}

export function isYesterday(target: Date | null | undefined, reference: Date): boolean {
  if (!target) return false;
  return startOfDay(target).getTime() === addDays(reference, -1).getTime();
}

export function dayLabel(date: Date): string {
  return DAY_NAMES[date.getDay()];
}

export function weekDatesEndingToday(today = new Date()): Date[] {
  return Array.from({ length: 7 }, (_, index) => addDays(today, index - 6));
}

export function monthDaysAgo(days: number, from = new Date()): Date[] {
  return Array.from({ length: days }, (_, index) => addDays(from, -index));
}
