export type QuestionType =
  | 'kana_symbol_to_reading'
  | 'kana_reading_to_symbol'
  | 'kana_fill_blank'
  | 'kanji_to_meaning'
  | 'meaning_to_kanji'
  | 'word_to_reading'
  | 'kanji_in_context'
  | 'word_composition';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'hiragana' | 'katakana' | 'kanji' | 'vocabulary' | 'grammar';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  estimatedTime: number;
  completed: boolean;
  questions: Question[];
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  hint?: string;
  explanation?: string;
}

export interface TestResult {
  testId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: string;
  answers: { questionId: string; userAnswer: string; correct: boolean }[];
}

export type PracticeType = 'flashcards' | 'writing' | 'matching' | 'quiz';

export interface PracticeSession {
  id: string;
  type: PracticeType;
  title: string;
  description: string;
  icon: string;
  itemCount: number;
  completedCount: number;
  accuracy: number;
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  kana_symbol_to_reading: 'K1 · Символ → чтение',
  kana_reading_to_symbol: 'K2 · Чтение → символ',
  kana_fill_blank: 'K3 · Пропуск в слове',
  kanji_to_meaning: 'D1 · Кандзи → значение',
  meaning_to_kanji: 'D2 · Значение → кандзи',
  word_to_reading: 'D3 · Слово → чтение',
  kanji_in_context: 'D4 · Кандзи в контексте',
  word_composition: 'D5 · Состав слова',
};

export const ALPHABET_QUESTION_TYPES: QuestionType[] = [
  'kana_symbol_to_reading',
  'kana_reading_to_symbol',
  'kana_fill_blank',
];

export const KANJI_QUESTION_TYPES: QuestionType[] = [
  'kanji_to_meaning',
  'meaning_to_kanji',
  'word_to_reading',
  'kanji_in_context',
  'word_composition',
];
