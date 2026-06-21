import { hiraganaGroups } from './hiraganaData';
import { katakanaGroups } from './katakanaData';
import { kanjiList } from './kanjiData';
import { dictionaryEntries } from './dictionaryData';
import { mockUser, mockUserStats } from './userData';
import { mockLessons, mockPracticeSessions } from './lessonData';

const mockRoutes: Record<string, unknown> = {
  '/api/kana/hiragana': hiraganaGroups,
  '/api/kana/katakana': katakanaGroups,
  '/api/kanji': kanjiList,
  '/api/dictionary': dictionaryEntries,
  '/api/user/me': mockUser,
  '/api/user/stats': mockUserStats,
  '/api/lessons': mockLessons,
  '/api/practice': mockPracticeSessions,
};

export function getMockData<T>(endpoint: string): T {
  // Strip query parameters
  const cleanEndpoint = endpoint.split('?')[0];
  const data = mockRoutes[cleanEndpoint];
  if (!data) throw new Error(`Mock route not found: ${cleanEndpoint}`);
  return data as T;
}

export function postMockData<T>(endpoint: string, _body: unknown): T {
  // Simple post route handler for update profile or submit test
  if (endpoint === '/api/user/me') {
    const updated = { ...mockUser, ...(_body as Record<string, unknown>) };
    return updated as T;
  }
  return { success: true } as T;
}
