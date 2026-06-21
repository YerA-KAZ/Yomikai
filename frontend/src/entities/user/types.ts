export interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  longestStreak: number;
  dailyGoal: number;
  dailyXp: number;
  joinedAt: string;
  totalStudyTime: number; // minutes
  learnedKana: number;
  learnedKanji: number;
  learnedWords: number;
  achievements: Achievement[];
  recentLessons: RecentLesson[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  unlockedAt: string;
  progress: number;
  maxProgress: number;
}

export interface RecentLesson {
  id: string;
  title: string;
  type: 'hiragana' | 'katakana' | 'kanji' | 'vocabulary' | 'grammar';
  progress: number;
  lastAccessed: string;
  xpEarned: number;
}

export interface UserStats {
  totalXp: number;
  studyDays: number;
  accuracy: number;
  wordsLearned: number;
  kanjiLearned: number;
  kanaLearned: number;
  totalStudyTime: number;
  weeklyActivity: { day: string; minutes: number }[];
}
