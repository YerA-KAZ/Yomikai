import { apiDelete, apiGet, apiPost } from './client';
import type { QuestionType } from '../../entities/lesson/types';

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

export interface DictionaryEntry {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  partOfSpeech: string;
  jlptLevel: string;
  examples: { japanese: string; russian: string }[];
  tags: string[];
  sortOrder: number;
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
  hint?: string;
  strokes?: { paths: string[]; order: number }[];
  words?: { word: string; reading: string; meaning: string }[];
}

export interface AdminLesson {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  xpReward: number;
  estimatedTime: number;
  questionCount: number;
}

export interface LessonCreateInput {
  title: string;
  description: string;
  type: 'hiragana' | 'katakana' | 'kanji' | 'vocabulary' | 'grammar';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  estimatedTime: number;
}

export interface AdminTestQuestion {
  id: string;
  lessonId: string;
  lessonTitle: string;
  lessonType: string;
  type: QuestionType;
  question: string;
  options: string[] | null;
  correctAnswer: string;
  hint: string | null;
  explanation: string | null;
  sortOrder: number;
}

export interface TestCreateInput {
  lessonId: string;
  type: QuestionType;
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

  getDictionary: () => apiGet<DictionaryEntry[]>('/api/admin/dictionary'),
  addDictionary: (input: DictionaryCreateInput) => apiPost<DictionaryEntry>('/api/admin/dictionary', input),
  deleteDictionary: (id: string) => apiDelete<void>(`/api/admin/dictionary/${id}`),

  addKanji: (input: KanjiCreateInput) => apiPost('/api/admin/kanji', input),

  getLessons: () => apiGet<AdminLesson[]>('/api/admin/lessons'),
  addLesson: (input: LessonCreateInput) => apiPost('/api/admin/lessons', input),
  getTests: () => apiGet<AdminTestQuestion[]>('/api/admin/tests'),
  addTest: (input: TestCreateInput) => apiPost('/api/admin/tests', input),
  deleteTest: (id: string) => apiDelete<void>(`/api/admin/tests/${id}`),
};
