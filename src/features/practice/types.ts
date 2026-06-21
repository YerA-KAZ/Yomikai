export interface PracticeProgress {
  completedIds: string[];
  correctCount: number;
  totalAttempts: number;
  lastPlayedAt?: string;
}

export interface RoundResult {
  correct: number;
  total: number;
  accuracy: number;
}
