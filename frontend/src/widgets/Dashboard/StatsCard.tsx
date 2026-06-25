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

  // Calculate metrics for chart
  const maxWeeklyMinutes = Math.max(...stats.weeklyActivity.map((day) => day.minutes), 10);
  const totalWeeklyMinutes = stats.weeklyActivity.reduce((acc, curr) => acc + curr.minutes, 0);
  const avgMinutes = Math.round(totalWeeklyMinutes / stats.weeklyActivity.length);
  const avgHeightPercentage = Math.max((avgMinutes / maxWeeklyMinutes) * 100, 5);

  return (
    <Card hoverable className="p-5 flex flex-col gap-6">
      <h3 className="text-lg font-bold text-text">Общая статистика</h3>

      {/* Grid of micro cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-bg-secondary/60 border border-border/10 p-3.5 rounded-2xl flex items-center gap-3 transition-colors hover:bg-surface-hover/50">
          <div className="text-amber-500 bg-amber-500/10 p-2 rounded-xl shadow-inner">
            <Award className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider">Всего опыта</span>
            <span className="text-base font-black text-text">{stats.totalXp} XP</span>
          </div>
        </div>

        <div className="bg-bg-secondary/60 border border-border/10 p-3.5 rounded-2xl flex items-center gap-3 transition-colors hover:bg-surface-hover/50">
          <div className="text-primary bg-primary/10 p-2 rounded-xl shadow-inner">
            <Flame className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider">Дней учебы</span>
            <span className="text-base font-black text-text">{stats.studyDays} дн</span>
          </div>
        </div>

        <div className="bg-bg-secondary/60 border border-border/10 p-3.5 rounded-2xl flex items-center gap-3 transition-colors hover:bg-surface-hover/50">
          <div className="text-emerald-500 bg-emerald-500/10 p-2 rounded-xl shadow-inner">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider">Слов выучено</span>
            <span className="text-base font-black text-text">{stats.wordsLearned}</span>
          </div>
        </div>

        <div className="bg-bg-secondary/60 border border-border/10 p-3.5 rounded-2xl flex items-center gap-3 transition-colors hover:bg-surface-hover/50">
          <div className="text-blue-500 bg-blue-500/10 p-2 rounded-xl shadow-inner">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider">Время за всё время</span>
            <span className="text-base font-black text-text">{formatTime(stats.totalStudyTime)}</span>
          </div>
        </div>
      </div>

      {/* Weekly activity chart */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-text-secondary">Активность за неделю</span>
          <span className="text-[10px] font-bold text-text-muted bg-bg-secondary px-2 py-0.5 rounded-md">
            В среднем {avgMinutes} мин/день
          </span>
        </div>
        
        <div className="relative flex justify-between items-end h-[120px] bg-surface/40 border border-border/10 p-4 rounded-2xl mt-1 overflow-hidden">
          
          {/* Average Line */}
          <div 
            className="absolute left-0 right-0 border-t border-dashed border-text-muted/30 z-0 flex items-center pointer-events-none"
            style={{ bottom: `calc(${avgHeightPercentage}% + 1rem)` }}
          >
            <span className="absolute -top-3 left-2 text-[8px] font-bold text-text-muted/60">СРЕДНЕЕ</span>
          </div>

          {stats.weeklyActivity.map((day, idx) => {
            const heightPercentage = day.minutes > 0 ? Math.max((day.minutes / maxWeeklyMinutes) * 100, 4) : 0;
            const isToday = idx === stats.weeklyActivity.length - 1;
            
            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end flex-1 z-10">
                <div className="group relative w-full flex justify-center">
                  <span className="absolute bottom-full mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-surface border border-border px-2 py-1 rounded-lg text-[10px] font-bold text-text shadow-md whitespace-nowrap">
                      {day.minutes} мин
                    </div>
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: day.minutes > 0 ? `${heightPercentage}%` : '2px' }}
                    transition={{ delay: idx * 0.05, duration: 0.6, ease: 'easeOut', type: 'spring', stiffness: 100 }}
                    className={`w-6 sm:w-8 rounded-t-md rounded-b-sm shadow-[0_-2px_10px_rgba(var(--theme-primary-rgb),0.1)] transition-colors cursor-pointer hover:brightness-110 ${
                      day.minutes === 0
                        ? 'bg-border/20'
                        : isToday 
                          ? 'bg-gradient-to-t from-primary/80 to-accent' 
                          : 'bg-primary/30 hover:bg-primary/50'
                    }`}
                  />
                </div>
                <span className={`text-[9px] font-bold ${isToday ? 'text-primary' : 'text-text-muted'}`}>
                  {day.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
export default StatsCard;
