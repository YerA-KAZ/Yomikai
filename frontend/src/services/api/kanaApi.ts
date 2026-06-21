import { apiGet } from './client';
import type { KanaGroup } from '../../entities/kana/types';

export const kanaApi = {
  getHiragana: () => apiGet<KanaGroup[]>('/api/kana/hiragana'),
  getKatakana: () => apiGet<KanaGroup[]>('/api/kana/katakana'),
};
