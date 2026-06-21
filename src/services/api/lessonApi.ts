import { apiGet, apiPost } from './client';
import type { Lesson, PracticeSession, TestResult } from '../../entities/lesson/types';

export const lessonApi = {
  getAll: () => apiGet<Lesson[]>('/api/lessons'),
  getById: (id: string) => apiGet<Lesson>(`/api/lessons/${id}`),
  submitTest: (result: TestResult) => apiPost<{ success: boolean }>('/api/tests/submit', result),
  getPracticeSessions: () => apiGet<PracticeSession[]>('/api/practice'),
};
