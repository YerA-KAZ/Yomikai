import { apiDelete, apiGet, apiPost } from './client';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  league: string | null;
  weeklyXp: number;
  joinedAt: string;
}

export interface DictionaryCreateInput {
  word: string;
  reading: string;
  meaning: string;
  partOfSpeech: string;
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  examples?: { japanese: string; russian: string }[];
  tags?: string[];
}

export interface KanjiCreateInput {
  char: string;
  meaning: string;
  onyomi?: string[];
  kunyomi?: string[];
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  strokeCount: number;
  examples?: { word: string; reading: string; meaning: string }[];
  radical: string;
  learned?: boolean;
}

export interface TestCreateInput {
  lessonId: string;
  type: 'multiple_choice' | 'typing' | 'matching' | 'listening';
  question: string;
  options?: string[];
  correctAnswer: string;
  hint?: string;
  explanation?: string;
}

export const adminApi = {
  getUsers: () => apiGet<AdminUser[]>('/api/admin/users'),
  resetUserXp: (id: string) => apiPost<AdminUser>(`/api/admin/users/${id}/reset`, {}),
  deleteUser: (id: string) => apiDelete<void>(`/api/admin/users/${id}`),
  addDictionary: (input: DictionaryCreateInput) => apiPost('/api/admin/dictionary', input),
  addKanji: (input: KanjiCreateInput) => apiPost('/api/admin/kanji', input),
  addTest: (input: TestCreateInput) => apiPost('/api/admin/tests', input),
};
