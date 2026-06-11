import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Card } from '../../shared/ui/Card';

interface StreakCardProps {
  streak: number;
  longestStreak: number;
}

export const StreakCard: React.FC<StreakCardProps> = ({ streak, longestStreak }) => {
  const days = [
    { label: 'П', active: true, isCurrent: false },
    { label: 'В', active: true, isCurrent: false },
    { label: 'С', active: true, isCurrent: false },
    { label: 'Ч', active: true, isCurrent: false },
    { label: 'П', active: true, isCurrent: false },
    { label: 'С', active: true, isCurrent: true },
    { label: 'В', active: false, isCurrent: false },
  ];

  return (
    <Card hoverable className="p-5 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-xs uppercase font-bold tracking-wider text-text-muted">Ударный режим</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-black text-text">{streak}</span>
            <span className="text-sm font-semibold text-text-secondary">дней</span>
          </div>
          <span className="text-xs text-text-muted mt-1 font-medium">Рекорд: {longestStreak} дней</span>
        </div>

        <motion.div
          animate={{ scale: [1, 1.1, 1], filter: ['drop-shadow(0 0 4px #FF6B35)', 'drop-shadow(0 0 10px #FF8C00)', 'drop-shadow(0 0 4px #FF6B35)'] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="text-primary bg-primary/10 p-3 rounded-2xl border border-primary/20"
        >
          <Flame className="w-8 h-8 fill-current" />
        </motion.div>
      </div>

      <div className="grid grid-cols-7 gap-2 mt-2">
        {days.map((day, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs border transition-all ${
                day.active
                  ? 'bg-gradient-to-br from-primary to-accent text-white border-transparent shadow-sm'
                  : day.isCurrent
                  ? 'bg-transparent border-primary/50 text-primary animate-pulse'
                  : 'bg-bg-secondary border-border text-text-muted'
              }`}
            >
              {day.active ? (
                <Flame className="w-4 h-4 fill-current" />
              ) : (
                day.label
              )}
            </div>
            <span className="text-[10px] font-bold text-text-muted">{day.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
export default StreakCard;
