import type { KanaGroup } from '../../entities/kana/types';
import type { PracticeProgress } from './types';

export function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function flattenKana(groups: KanaGroup[]) {
  return groups.flatMap((g) => g.chars);
}

export function pickRandom<T>(items: T[], count: number, exclude?: T): T[] {
  const pool = exclude ? items.filter((item) => item !== exclude) : items;
  return shuffle(pool).slice(0, count);
}

export function pickDistractors<T>(
  items: T[],
  correct: T,
  count: number,
  keyFn: (item: T) => string
): T[] {
  const correctKey = keyFn(correct);
  const pool = items.filter((item) => keyFn(item) !== correctKey);
  return shuffle(pool).slice(0, count);
}

const STORAGE_PREFIX = 'yomikai-practice-';

export function loadProgress(sessionId: string): PracticeProgress {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${sessionId}`);
    if (raw) return JSON.parse(raw) as PracticeProgress;
  } catch {
    /* ignore */
  }
  return { completedIds: [], correctCount: 0, totalAttempts: 0 };
}

export function saveProgress(sessionId: string, progress: PracticeProgress): void {
  localStorage.setItem(`${STORAGE_PREFIX}${sessionId}`, JSON.stringify(progress));
}

export function getProgressStats(progress: PracticeProgress) {
  return {
    completedCount: progress.completedIds.length,
    accuracy: progress.totalAttempts > 0
      ? Math.round((progress.correctCount / progress.totalAttempts) * 100)
      : 0,
  };
}
