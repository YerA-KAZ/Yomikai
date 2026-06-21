import { useCallback, useState } from 'react';
import type { PracticeProgress, RoundResult } from './types';
import { getProgressStats, loadProgress, saveProgress } from './utils';

export function usePracticeProgress(sessionId: string) {
  const [progress, setProgress] = useState<PracticeProgress>(() => loadProgress(sessionId));

  const recordAnswer = useCallback(
    (itemId: string, correct: boolean) => {
      setProgress((prev) => {
        const next: PracticeProgress = {
          completedIds: prev.completedIds.includes(itemId)
            ? prev.completedIds
            : [...prev.completedIds, itemId],
          correctCount: prev.correctCount + (correct ? 1 : 0),
          totalAttempts: prev.totalAttempts + 1,
          lastPlayedAt: new Date().toISOString(),
        };
        saveProgress(sessionId, next);
        return next;
      });
    },
    [sessionId]
  );

  const recordRound = useCallback(
    (results: { itemId: string; correct: boolean }[]) => {
      setProgress((prev) => {
        const newCompleted = new Set(prev.completedIds);
        let correctCount = prev.correctCount;
        let totalAttempts = prev.totalAttempts;

        for (const { itemId, correct } of results) {
          newCompleted.add(itemId);
          if (correct) correctCount += 1;
          totalAttempts += 1;
        }

        const next: PracticeProgress = {
          completedIds: Array.from(newCompleted),
          correctCount,
          totalAttempts,
          lastPlayedAt: new Date().toISOString(),
        };
        saveProgress(sessionId, next);
        return next;
      });
    },
    [sessionId]
  );

  const stats = getProgressStats(progress);

  return { progress, stats, recordAnswer, recordRound };
}

export function buildRoundResult(correct: number, total: number): RoundResult {
  return {
    correct,
    total,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
  };
}
