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

  const getPracticeConfig = (type: string) => {
    switch (type) {
      case 'flashcards':
        return { 
          icon: <Layers className="w-8 h-8 text-white drop-shadow-md" />, 
          gradient: 'from-blue-500/20 to-blue-600/5', 
          iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/30',
          borderColor: 'border-blue-500/20 hover:border-blue-500/50'
        };
      case 'writing':
        return { 
          icon: <PenTool className="w-8 h-8 text-white drop-shadow-md" />, 
          gradient: 'from-amber-500/20 to-amber-600/5', 
          iconBg: 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-amber-500/30',
          borderColor: 'border-amber-500/20 hover:border-amber-500/50'
        };
      case 'matching':
        return { 
          icon: <Puzzle className="w-8 h-8 text-white drop-shadow-md" />, 
          gradient: 'from-emerald-500/20 to-emerald-600/5', 
          iconBg: 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/30',
          borderColor: 'border-emerald-500/20 hover:border-emerald-500/50'
        };
      case 'quiz':
        return { 
          icon: <HelpCircle className="w-8 h-8 text-white drop-shadow-md" />, 
          gradient: 'from-purple-500/20 to-purple-600/5', 
          iconBg: 'bg-gradient-to-br from-purple-400 to-purple-600 shadow-purple-500/30',
          borderColor: 'border-purple-500/20 hover:border-purple-500/50'
        };
      default:
        return { 
          icon: <Sparkles className="w-8 h-8 text-white drop-shadow-md" />, 
          gradient: 'from-primary/20 to-accent/5', 
          iconBg: 'bg-gradient-to-br from-primary to-accent shadow-primary/30',
          borderColor: 'border-primary/20 hover:border-primary/50'
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
          const progressPercentage = Math.round((session.completedCount / session.itemCount) * 100);
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
                className={`p-5 sm:p-6 flex flex-col gap-5 min-h-[280px] h-full relative overflow-hidden group bg-gradient-to-br border transition-colors ${config.gradient} ${config.borderColor}`}
              >
                {/* Decorative background icon */}
                <div className="absolute -right-6 -top-6 text-white/5 group-hover:text-white/10 transition-colors pointer-events-none transform group-hover:scale-110 duration-500">
                   {React.cloneElement(config.icon as React.ReactElement<{className?: string}>, { className: 'w-48 h-48 drop-shadow-none' })}
                </div>

                {/* Header info */}
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex gap-4 min-w-0">
                    <div className={`p-4 rounded-2xl flex-shrink-0 shadow-lg ${config.iconBg} transform group-hover:-translate-y-1 transition-transform`}>
                      {config.icon}
                    </div>
                    <div className="flex flex-col min-w-0 pt-1">
                      <h3 className="text-xl font-black text-text truncate group-hover:text-primary transition-colors">{session.title}</h3>
                      <span className="text-xs text-text-secondary mt-1 leading-snug line-clamp-3">{session.description}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-auto relative z-10">
                  {/* Stats Row */}
                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <Badge variant="default" className="text-[10px] font-black uppercase tracking-wider bg-surface/80 backdrop-blur-sm">
                      Точность: {session.accuracy}%
                    </Badge>
                    <div className="text-[10px] font-bold text-text-secondary bg-bg-secondary/50 px-2 py-1 rounded-md border border-border/10">
                      {session.completedCount} / {session.itemCount} ({progressPercentage}%)
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="bg-surface/50 p-2 rounded-xl border border-border/10 backdrop-blur-sm shadow-inner">
                    <ProgressBar value={session.completedCount} max={session.itemCount} height="sm" />
                  </div>

                  {/* Play button CTA */}
                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full sm:w-auto flex items-center gap-1.5 rounded-xl text-xs font-black shadow-lg hover:scale-105"
                      onClick={() => alert(`Режим «${session.title}» будет доступен в следующем обновлении!`)}
                    >
                      Старт <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
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
