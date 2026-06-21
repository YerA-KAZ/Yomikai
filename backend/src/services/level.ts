export const LEVELS = [
  { level: 1, name: 'Новичок', minXp: 0 },
  { level: 2, name: 'Ученик', minXp: 100 },
  { level: 3, name: 'Практик', minXp: 250 },
  { level: 4, name: 'Исследователь', minXp: 500 },
  { level: 5, name: 'Собеседник', minXp: 900 },
  { level: 6, name: 'Знаток', minXp: 1500 },
  { level: 7, name: 'Лингвист', minXp: 2300 },
  { level: 8, name: 'Эксперт', minXp: 3400 },
  { level: 9, name: 'Мастер', minXp: 4800 },
  { level: 10, name: 'Полиглот', minXp: 6500 },
] as const;

export function getLevelInfo(xp: number) {
  let current: (typeof LEVELS)[number] = LEVELS[0];

  for (const level of LEVELS) {
    if (xp >= level.minXp) {
      current = level;
      continue;
    }
    break;
  }

  const nextLevel = LEVELS.find((level) => level.level === current.level + 1);

  return {
    level: current.level,
    name: current.name,
    xpToNextLevel: nextLevel ? nextLevel.minXp : current.minXp,
  };
}
