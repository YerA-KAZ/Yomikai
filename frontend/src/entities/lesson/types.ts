export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'hiragana' | 'katakana' | 'kanji' | 'vocabulary' | 'grammar';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  estimatedTime: number; // minutes
  completed: boolean;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'typing' | 'matching' | 'listening';
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
