import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Clock, HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { lessonApi } from '../services/api/lessonApi';
import { Card } from '../shared/ui/Card';
import { Button } from '../shared/ui/Button';
import { Badge } from '../shared/ui/Badge';
import type { Lesson } from '../entities/lesson/types';

export const TestsPage: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('Все');

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
      <div className="flex flex-col gap-6 py-6 items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-text-muted font-bold text-sm">Загрузка доступных тестов...</span>
      </div>
    );
  }

  const filterTabs = ['Все', 'Начальный', 'Средний', 'Продвинутый'];

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6 text-text">
      {/* Header Info */}
      <div className="flex flex-col bg-surface/30 border border-border/10 p-5 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold">Тесты</h1>
          <Badge variant="warning" className="font-bold">テスト</Badge>
        </div>
        <p className="text-text-secondary text-sm font-medium mt-1">
          Проверьте уровень своих знаний с помощью интерактивных тестов. Получайте дополнительные очки опыта (XP).
        </p>
      </div>

      {/* Difficulty Tabs */}
      <div className="flex bg-bg-secondary p-1 rounded-2xl border border-border/10 self-start overflow-x-auto whitespace-nowrap max-w-full">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setDifficultyFilter(tab)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              difficultyFilter === tab
                ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                : 'text-text-muted hover:text-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredLessons.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-surface/10 rounded-3xl border border-dashed border-border/20 gap-3">
          <span className="text-text-muted font-bold text-sm">Нет доступных тестов</span>
          <span className="text-xs text-text-secondary">Попробуйте выбрать другую сложность фильтра.</span>
        </div>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredLessons.map((lesson, idx) => (
            <motion.div
              key={lesson.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card
                className={`p-6 flex flex-col justify-between h-[260px] relative overflow-hidden border border-border/10 bg-surface/40 ${
                  lesson.completed ? 'border-emerald-500/20 bg-emerald-500/5' : ''
                }`}
              >
                {/* Visual completion banner */}
                {lesson.completed && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 rounded-bl-xl text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Пройдено
                  </div>
                )}

                {/* Header details */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={getDifficultyBadgeVariant(lesson.difficulty)} className="text-[9px] font-bold uppercase tracking-wider">
                      {getDifficultyTranslation(lesson.difficulty)}
                    </Badge>
                    <Badge variant="default" className="text-[9px] uppercase font-bold tracking-wider">
                      {lesson.type}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-black mt-1 leading-snug">{lesson.title}</h3>
                  <span className="text-xs text-text-secondary line-clamp-2 leading-relaxed mt-1">{lesson.description}</span>
                </div>

                {/* Bottom stats & CTA */}
                <div className="flex flex-col gap-4 mt-3">
                  <div className="flex items-center justify-between text-xs text-text-muted font-semibold bg-bg-secondary/40 border border-border/5 py-2 px-3 rounded-xl">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>~{lesson.estimatedTime} минут</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{lesson.questions.length} вопросов</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 border border-emerald-500/15 font-black text-xs px-2.5 py-1 rounded-xl">
                      <Award className="w-3.5 h-3.5" />
                      <span>+{lesson.xpReward} XP</span>
                    </div>

                    <Button
                      variant={lesson.completed ? 'secondary' : 'primary'}
                      size="sm"
                      className="flex items-center gap-1 rounded-xl text-xs font-bold px-4"
                      onClick={() => alert(`Тестирование по теме «${lesson.title}» будет доступно в следующем обновлении!`)}
                    >
                      {lesson.completed ? 'Пройти снова' : 'Начать тест'} <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default TestsPage;
