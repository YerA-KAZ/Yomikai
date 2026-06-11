import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, PenTool, Puzzle, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { lessonApi } from '../services/api/lessonApi';
import { Card } from '../shared/ui/Card';
import { Button } from '../shared/ui/Button';
import { ProgressBar } from '../shared/ui/ProgressBar';
import { Badge } from '../shared/ui/Badge';
import type { PracticeSession } from '../entities/lesson/types';

export const PracticePage: React.FC = () => {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lessonApi.getPracticeSessions()
      .then((data) => {
        setSessions(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const getPracticeIcon = (type: string) => {
    const iconClass = 'w-6 h-6 text-primary';
    switch (type) {
      case 'flashcards':
        return <Layers className={iconClass} />;
      case 'writing':
        return <PenTool className={iconClass} />;
      case 'matching':
        return <Puzzle className={iconClass} />;
      case 'quiz':
        return <HelpCircle className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 py-6 items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-text-muted font-bold text-sm">Загрузка режимов практики...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6 text-text">
      {/* Header Info */}
      <div className="flex flex-col bg-surface/30 border border-border/10 p-5 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold">Практика</h1>
          <Badge variant="info" className="font-bold">練習</Badge>
        </div>
        <p className="text-text-secondary text-sm font-medium mt-1">
          Разнообразные игровые упражнения для закрепления выученных азбук, иероглифов и лексики.
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sessions.map((session, idx) => {
          const progressPercentage = Math.round((session.completedCount / session.itemCount) * 100);
          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card hoverable className="p-6 flex flex-col justify-between h-[240px]">
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 border border-primary/20 p-3.5 rounded-2xl flex-shrink-0 shadow-sm">
                      {getPracticeIcon(session.type)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-lg font-bold text-text truncate">{session.title}</h3>
                      <span className="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">{session.description}</span>
                    </div>
                  </div>
                  <Badge variant="default" className="text-[10px] font-bold shrink-0">
                    Точность: {session.accuracy}%
                  </Badge>
                </div>

                {/* Progress bar info */}
                <div className="flex flex-col gap-1.5 mt-3">
                  <div className="flex justify-between items-center text-xs font-bold text-text-secondary">
                    <span>Выполнено символов/слов</span>
                    <span className="text-text">{session.completedCount} / {session.itemCount} ({progressPercentage}%)</span>
                  </div>
                  <ProgressBar value={session.completedCount} max={session.itemCount} height="sm" />
                </div>

                {/* Play button CTA */}
                <div className="flex justify-end mt-4">
                  <Button
                    variant="secondary"
                    size="md"
                    className="flex items-center gap-1.5 rounded-xl text-xs font-bold border-primary/20 hover:border-primary/45"
                    onClick={() => alert(`Режим «${session.title}» будет доступен в следующем обновлении!`)}
                  >
                    Запустить <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
export default PracticePage;
