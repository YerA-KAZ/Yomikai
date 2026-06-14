import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, PenTool, Languages, GraduationCap, ArrowRight, Clock } from 'lucide-react';
import { Card } from '../../shared/ui/Card';
import { ProgressBar } from '../../shared/ui/ProgressBar';
import { Button } from '../../shared/ui/Button';
import type { RecentLesson } from '../../entities/user/types';

interface RecentLessonsProps {
  lessons: RecentLesson[];
}

export const RecentLessons: React.FC<RecentLessonsProps> = ({ lessons }) => {
  const navigate = useNavigate();

  const getLessonConfig = (type: RecentLesson['type']) => {
    switch (type) {
      case 'hiragana':
      case 'katakana':
        return { icon: <Languages className="w-5 h-5" />, colorClass: 'text-blue-500 bg-blue-500/10 border-blue-500/20', label: 'Азбука' };
      case 'kanji':
        return { icon: <PenTool className="w-5 h-5" />, colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20', label: 'Иероглифы' };
      case 'vocabulary':
        return { icon: <BookOpen className="w-5 h-5" />, colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', label: 'Словарь' };
      default:
        return { icon: <GraduationCap className="w-5 h-5" />, colorClass: 'text-primary bg-primary/10 border-primary/20', label: 'Практика' };
    }
  };

  const getLessonRoute = (type: RecentLesson['type']) => {
    switch (type) {
      case 'hiragana': return '/hiragana';
      case 'katakana': return '/katakana';
      case 'kanji': return '/kanji';
      case 'vocabulary': return '/dictionary';
      default: return '/practice';
    }
  };

  // Helper to format date to relative time
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) return `${diffDays} дн. назад`;
    return 'Давно';
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-text">Недавние темы</h3>
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
      <div className="flex gap-4 overflow-x-auto pb-4 px-1 scrollbar-none snap-x snap-mandatory">
        {lessons.map((lesson, idx) => {
          const config = getLessonConfig(lesson.type);
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex-shrink-0 w-[260px] sm:w-[280px] snap-start"
            >
              <Card
                hoverable
                onClick={() => navigate(getLessonRoute(lesson.type))}
                className="p-5 flex flex-col gap-4 min-h-[168px] justify-between cursor-pointer border border-border/10 bg-surface/50 group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border shadow-inner ${config.colorClass}`}>
                      {config.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-extrabold text-text-muted tracking-wider">
                        {config.label}
                      </span>
                      <span className="text-sm font-bold text-text truncate max-w-[140px] group-hover:text-primary transition-colors">
                        {lesson.title}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/15">
                      +{lesson.xpEarned} XP
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-text-muted">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(lesson.lastAccessed)}
                    </div>
                  </div>
                  <ProgressBar value={lesson.progress} height="md" />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Continue Learning CTA */}
      <motion.div
        animate={{ filter: ['drop-shadow(0 0 0 rgba(0,0,0,0))', 'drop-shadow(0 10px 20px rgba(var(--theme-primary-rgb),0.3))', 'drop-shadow(0 0 0 rgba(0,0,0,0))'] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="mt-1"
      >
        <Button
          variant="primary"
          size="lg"
          className="w-full justify-between items-center rounded-2xl border border-white/20"
          onClick={() => {
            const next = lessons.find((l) => l.progress < 100) || lessons[0];
            navigate(next ? getLessonRoute(next.type) : '/hiragana');
          }}
        >
          <span className="font-extrabold tracking-wide">Продолжить обучение</span>
          <div className="bg-white/20 p-1.5 rounded-xl">
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
        </Button>
      </motion.div>
    </div>
  );
};
export default RecentLessons;
