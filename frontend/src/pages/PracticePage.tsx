import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, PenTool, Puzzle, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { lessonApi } from '../services/api/lessonApi';
import { Card } from '../shared/ui/Card';
import { Button } from '../shared/ui/Button';
import { ProgressBar } from '../shared/ui/ProgressBar';
import { Badge } from '../shared/ui/Badge';
import type { PracticeSession } from '../entities/lesson/types';
import { getProgressStats, loadProgress } from '../features/practice/utils';

export const PracticePage: React.FC = () => {
  const navigate = useNavigate();
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

  const getPracticeConfig = (type: string) => {
    switch (type) {
      case 'flashcards':
        return { 
          icon: <Layers className="w-6 h-6 text-blue-500" />, 
          iconBg: 'bg-blue-500/10 border border-blue-500/20',
        };
      case 'writing':
        return { 
          icon: <PenTool className="w-6 h-6 text-amber-500" />, 
          iconBg: 'bg-amber-500/10 border border-amber-500/20',
        };
      case 'matching':
        return { 
          icon: <Puzzle className="w-6 h-6 text-emerald-500" />, 
          iconBg: 'bg-emerald-500/10 border border-emerald-500/20',
        };
      case 'quiz':
        return { 
          icon: <HelpCircle className="w-6 h-6 text-purple-500" />, 
          iconBg: 'bg-purple-500/10 border border-purple-500/20',
        };
      default:
        return { 
          icon: <Sparkles className="w-6 h-6 text-primary" />, 
          iconBg: 'bg-primary/10 border border-primary/20',
        };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 py-4 md:py-6 w-full">
        <div className="h-[100px] bg-surface/50 border border-border/10 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-[240px] bg-surface/50 border border-border/10 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6 text-text">
      {/* Header Info */}
      <div className="flex flex-col glass border border-border/10 p-5 rounded-3xl">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold drop-shadow-sm">Практика</h1>
          <Badge variant="info" className="font-bold">練習</Badge>
        </div>
        <p className="text-text-secondary text-sm font-medium mt-1">
          Разнообразные игровые упражнения для закрепления выученных азбук, иероглифов и лексики.
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
        {sessions.map((session, idx) => {
          const saved = loadProgress(session.id);
          const { completedCount, accuracy } = getProgressStats(saved);
          const displayCompleted = completedCount || session.completedCount;
          const displayAccuracy = saved.totalAttempts > 0 ? accuracy : session.accuracy;
          const progressPercentage = Math.round((displayCompleted / session.itemCount) * 100);
          const config = getPracticeConfig(session.type);

          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card 
                hoverable 
                className="p-5 flex flex-col gap-4 h-full relative group bg-surface border border-border/15 hover:border-primary/30 transition-colors shadow-none hover:shadow-sm rounded-2xl"
              >
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className={`p-3 rounded-2xl flex-shrink-0 ${config.iconBg}`}>
                      {config.icon}
                    </div>
                    <div className="flex flex-col pt-1">
                      <h3 className="text-lg font-bold text-text truncate group-hover:text-primary transition-colors">{session.title}</h3>
                      <span className="text-sm text-text-secondary mt-0.5 line-clamp-2">{session.description}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-auto pt-2">
                  {/* Stats Row */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-secondary font-medium">
                      Точность: <span className="font-bold text-text">{displayAccuracy}%</span>
                    </span>
                    <span className="text-text-secondary font-medium">
                      <span className="font-bold text-text">{displayCompleted}</span> / {session.itemCount} ({progressPercentage}%)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <ProgressBar value={displayCompleted} max={session.itemCount} height="sm" />

                  {/* Play button CTA */}
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full mt-2 font-bold rounded-xl"
                    onClick={() => navigate(`/practice/${session.id}`)}
                  >
                    Перейти
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
