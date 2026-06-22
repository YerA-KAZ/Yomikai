import { apiGet, apiPost } from './client';
import type { KanjiChar } from '../../entities/kanji/types';

export const kanjiApi = {
  getAll: () => apiGet<KanjiChar[]>('/api/kanji'),
  getByLevel: (level: string) => apiGet<KanjiChar[]>(`/api/kanji?level=${level}`),
  markLearned: (kanjiId: string, xpReward: number) => apiPost<{ success: boolean }>('/api/kanji/learn', { kanjiId, xpReward }),
};
