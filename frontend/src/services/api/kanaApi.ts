import { apiGet, apiPost } from './client';
import type { KanaGroup } from '../../entities/kana/types';

export const kanaApi = {
  getHiragana: () => apiGet<KanaGroup[]>('/api/kana/hiragana'),
  getKatakana: () => apiGet<KanaGroup[]>('/api/kana/katakana'),
  markLearned: (kanaIds: string[], xpReward: number) => apiPost<{ success: boolean }>('/api/kana/learn', { kanaIds, xpReward }),
};
