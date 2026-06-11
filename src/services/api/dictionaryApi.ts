import { apiGet } from './client';
import type { DictionaryEntry } from '../../entities/dictionary/types';

export const dictionaryApi = {
  getAll: () => apiGet<DictionaryEntry[]>('/api/dictionary'),
  search: (query: string) => apiGet<DictionaryEntry[]>(`/api/dictionary?q=${query}`),
};
