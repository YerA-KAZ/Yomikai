import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, PenTool, Languages, GraduationCap, ArrowRight } from 'lucide-react';
import { Card } from '../../shared/ui/Card';
import { ProgressBar } from '../../shared/ui/ProgressBar';
import { Button } from '../../shared/ui/Button';
import type { RecentLesson } from '../../entities/user/types';

interface RecentLessonsProps {
  lessons: RecentLesson[];
}

export const RecentLessons: React.FC<RecentLessonsProps> = ({ lessons }) => {
  const navigate = useNavigate();

  const getLessonIcon = (type: RecentLesson['type']) => {
    switch (type) {
      case 'hiragana':
      case 'katakana':
        return <Languages className="w-5 h-5 text-primary" />;
      case 'kanji':
        return <PenTool className="w-5 h-5 text-primary" />;
      case 'vocabulary':
        return <BookOpen className="w-5 h-5 text-primary" />;
      default:
        return <GraduationCap className="w-5 h-5 text-primary" />;
    }
  };

  const getLessonRoute = (type: RecentLesson['type']) => {
    switch (type) {
      case 'hiragana':
        return '/hiragana';
      case 'katakana':
        return '/katakana';
      case 'kanji':
        return '/kanji';
      case 'vocabulary':
        return '/dictionary';
      default:
        return '/practice';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-text">Последние уроки</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary text-xs hover:bg-transparent hover:underline flex items-center gap-1"
          onClick={() => navigate('/practice')}
        >
          Все уроки <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Horizontal scroll list */}
      <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
        {lessons.map((lesson, idx) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex-shrink-0 w-[260px] snap-start"
          >
            <Card
              hoverable
              onClick={() => navigate(getLessonRoute(lesson.type))}
              className="p-4 flex flex-col gap-3 h-[140px] justify-between cursor-pointer border border-border/10 bg-surface/50"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-xl border border-primary/15">
                    {getLessonIcon(lesson.type)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-text-muted">
                      {lesson.type === 'hiragana' || lesson.type === 'katakana' ? 'Азбука' : 'Урок'}
                    </span>
                    <span className="text-sm font-bold text-text truncate max-w-[150px]">{lesson.title}</span>
                  </div>
                </div>
                <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">
                  +{lesson.xpEarned} XP
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-semibold text-text-secondary">
                  <span>Прогресс</span>
                  <span>{lesson.progress}%</span>
                </div>
                <ProgressBar value={lesson.progress} height="sm" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Continue Learning CTA */}
      <motion.div
        animate={{ scale: [1, 1.015, 1] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="mt-1"
      >
        <Button
          variant="primary"
          size="lg"
          className="w-full justify-between items-center rounded-2xl shadow-lg shadow-primary/25"
          onClick={() => {
            const next = lessons.find((l) => l.progress < 100) || lessons[0];
            navigate(next ? getLessonRoute(next.type) : '/hiragana');
          }}
        >
          <span className="font-bold tracking-wide">Продолжить обучение</span>
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
};
export default RecentLessons;
