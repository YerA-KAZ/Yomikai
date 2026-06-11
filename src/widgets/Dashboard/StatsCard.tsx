import React from 'react';
import { motion } from 'framer-motion';
import { Award, Flame, Clock, BookOpen } from 'lucide-react';
import { Card } from '../../shared/ui/Card';
import type { UserStats } from '../../entities/user/types';

interface StatsCardProps {
  stats: UserStats | null;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  if (!stats) {
    return (
      <Card className="p-5 flex items-center justify-center h-[300px]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </Card>
    );
  }

  // Format total minutes to hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}м`;
    return `${hours}ч ${mins}м`;
  };

  // Find max minutes to scale chart heights proportionally
  const maxWeeklyMinutes = Math.max(...stats.weeklyActivity.map((day) => day.minutes), 10);

  return (
    <Card hoverable className="p-5 flex flex-col gap-6">
      <h3 className="text-lg font-bold text-text">Статистика</h3>

      {/* Grid of micro cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-bg-secondary/40 border border-border/10 p-3 rounded-2xl flex items-center gap-3">
          <div className="text-primary bg-primary/10 p-2 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase">Всего XP</span>
            <span className="text-base font-extrabold text-text">{stats.totalXp} XP</span>
          </div>
        </div>

        <div className="bg-bg-secondary/40 border border-border/10 p-3 rounded-2xl flex items-center gap-3">
          <div className="text-primary bg-primary/10 p-2 rounded-xl">
            <Flame className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase">Дней учебы</span>
            <span className="text-base font-extrabold text-text">{stats.studyDays} дн</span>
          </div>
        </div>

        <div className="bg-bg-secondary/40 border border-border/10 p-3 rounded-2xl flex items-center gap-3">
          <div className="text-primary bg-primary/10 p-2 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase">Слов выучено</span>
            <span className="text-base font-extrabold text-text">{stats.wordsLearned}</span>
          </div>
        </div>

        <div className="bg-bg-secondary/40 border border-border/10 p-3 rounded-2xl flex items-center gap-3">
          <div className="text-primary bg-primary/10 p-2 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase">Время учебы</span>
            <span className="text-base font-extrabold text-text">{formatTime(stats.totalStudyTime)}</span>
          </div>
        </div>
      </div>

      {/* Weekly activity chart */}
      <div className="flex flex-col gap-3">
        <span className="text-xs uppercase font-bold tracking-wider text-text-muted">Активность за неделю</span>
        <div className="flex justify-between items-end h-[100px] bg-bg-secondary/20 border border-border/5 p-4 rounded-2xl mt-1">
          {stats.weeklyActivity.map((day, idx) => {
            const heightPercentage = Math.max((day.minutes / maxWeeklyMinutes) * 100, 8);
            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end flex-1">
                <div className="group relative w-full flex justify-center">
                  <span className="absolute bottom-full mb-1 bg-surface border border-border px-1.5 py-0.5 rounded-lg text-[9px] font-bold text-text opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm">
                    {day.minutes} мин
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercentage}%` }}
                    transition={{ delay: idx * 0.05, duration: 0.6, ease: 'easeOut' }}
                    className="w-4 rounded-full bg-gradient-to-t from-primary to-accent shadow-[0_0_6px_rgba(var(--theme-primary),0.2)]"
                  />
                </div>
                <span className="text-[9px] font-bold text-text-muted">{day.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
export default StatsCard;
