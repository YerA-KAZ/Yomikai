import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Clock, HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { lessonApi } from '../services/api/lessonApi';
import { Card } from '../shared/ui/Card';
import { Button } from '../shared/ui/Button';
import { Badge } from '../shared/ui/Badge';
import type { Lesson } from '../entities/lesson/types';
import { QUESTION_TYPE_LABELS } from '../entities/lesson/types';

export const TestsPage: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('Все');
  const navigate = useNavigate();

  useEffect(() => {
    lessonApi.getAll()
      .then((data) => {
        setLessons(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const getDifficultyTranslation = (diff: Lesson['difficulty']) => {
    switch (diff) {
      case 'beginner': return 'Начальный';
      case 'intermediate': return 'Средний';
      default: return 'Продвинутый';
    }
  };

  const getDifficultyBadgeVariant = (diff: Lesson['difficulty']) => {
    switch (diff) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      default: return 'error';
    }
  };

  const filteredLessons = lessons.filter((lesson) => {
    if (difficultyFilter === 'Все') return true;
    if (difficultyFilter === 'Начальный') return lesson.difficulty === 'beginner';
    if (difficultyFilter === 'Средний') return lesson.difficulty === 'intermediate';
    return lesson.difficulty === 'advanced';
  });

  if (loading) {
    return (
      <div className="flex flex-col gap-6 py-4 md:py-6 w-full">
        <div className="h-[100px] bg-surface/50 border border-border/10 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
        </div>
        <div className="h-12 w-full max-w-lg bg-surface/50 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[260px] bg-surface/50 rounded-3xl relative overflow-hidden border border-border/5">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const filterTabs = ['Все', 'Начальный', 'Средний', 'Продвинутый'];

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6 text-text">
      {/* Header Info */}
      <div className="flex flex-col glass border border-border/10 p-5 rounded-3xl">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold drop-shadow-sm">Тесты</h1>
          <Badge variant="warning" className="font-bold">テスト</Badge>
        </div>
        <p className="text-text-secondary text-sm font-medium mt-1">
          Проверьте уровень своих знаний с помощью интерактивных тестов. Получайте дополнительные очки опыта (XP).
        </p>
      </div>

      {/* Difficulty Tabs */}
      <div className="flex flex-wrap gap-2 bg-surface/60 backdrop-blur-md p-2 rounded-2xl border border-border/20 self-start max-w-full shadow-sm">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setDifficultyFilter(tab)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
              difficultyFilter === tab
                ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/20'
                : 'text-text-muted hover:text-text hover:bg-bg-secondary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredLessons.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-surface/20 rounded-3xl border border-dashed border-border/40 gap-3">
          <div className="p-4 bg-bg-secondary/50 rounded-full mb-2">
             <HelpCircle className="w-8 h-8 text-text-muted/50" />
          </div>
          <span className="text-text-muted font-bold text-base">Нет доступных тестов</span>
          <span className="text-xs text-text-secondary">Попробуйте выбрать другую сложность фильтра.</span>
        </div>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        <AnimatePresence mode="popLayout">
          {filteredLessons.map((lesson, idx) => {
            // Determine gradient bar based on difficulty
            let diffGradient = 'from-emerald-400 to-emerald-600';
            if (lesson.difficulty === 'intermediate') diffGradient = 'from-amber-400 to-amber-600';
            if (lesson.difficulty === 'advanced') diffGradient = 'from-rose-400 to-rose-600';

            return (
            <motion.div
              key={lesson.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05, type: 'spring', stiffness: 200 }}
            >
              <Card
                hoverable
                className={`p-5 flex flex-col min-h-[220px] h-full relative group border bg-surface ${
                  lesson.completed 
                    ? 'border-emerald-500/30 bg-emerald-500/5' 
                    : 'border-border/15 hover:border-primary/30'
                }`}
              >
                {/* Visual completion banner */}
                {lesson.completed && (
                  <motion.div 
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="absolute top-1 right-0 bg-gradient-to-l from-emerald-500 to-emerald-400 text-white pl-4 pr-3 py-1 rounded-l-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Пройдено
                  </motion.div>
                )}

                {/* Header details */}
                <div className="flex flex-col gap-2 relative z-10 pt-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={getDifficultyBadgeVariant(lesson.difficulty)} className="text-[9px] font-black uppercase tracking-widest">
                      {getDifficultyTranslation(lesson.difficulty)}
                    </Badge>
                    {/* <Badge variant="default" className="text-[9px] uppercase font-bold tracking-wider">
                      {lesson.questions[0] ? QUESTION_TYPE_LABELS[lesson.questions[0].type] : lesson.type}
                    </Badge> */}
                  </div>
                  <h3 className="text-lg font-bold mt-2 leading-tight group-hover:text-primary transition-colors line-clamp-2">{lesson.title}</h3>
                  <span className="text-sm text-text-secondary line-clamp-2 mt-1">{lesson.description}</span>
                </div>

                {/* Bottom stats & CTA */}
                <div className="flex flex-col gap-3 mt-auto pt-2">
                  <div className="flex items-center justify-between text-xs text-text-secondary font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>~{lesson.estimatedTime} мин</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{lesson.questions.length} вопр.</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                      +{lesson.xpReward} XP
                    </span>
                    <Button
                      variant={lesson.completed ? 'secondary' : 'primary'}
                      size="sm"
                      className="font-bold rounded-xl px-4"
                      onClick={() => navigate(`/tests/${lesson.id}`)}
                    >
                      {lesson.completed ? 'Пройти снова' : 'Перейти'}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )})}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default TestsPage;
