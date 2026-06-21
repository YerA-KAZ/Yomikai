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

  // Visual milestone markers
  const milestones = [5, 10, 30, 100];
  const nextMilestone = milestones.find(m => m > streak) || milestones[milestones.length - 1];

  return (
    <Card hoverable className="p-5 flex flex-col gap-4 relative overflow-hidden">
      {/* Background glow if streak > 0 */}
      {streak > 0 && (
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      )}

      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col">
          <span className="text-xs uppercase font-extrabold tracking-widest text-text-muted">Ударный режим</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-black text-text drop-shadow-sm">{streak}</span>
            <span className="text-sm font-semibold text-text-secondary">дней</span>
          </div>
          <span className="text-[10px] text-text-muted mt-1 font-bold bg-surface/50 inline-block px-2 py-0.5 rounded-md border border-border/10 self-start">
            Рекорд: {longestStreak} дн.
          </span>
        </div>

        <motion.div
          animate={{ 
            scale: [1, 1.15, 1], 
            filter: ['drop-shadow(0 0 5px rgba(var(--theme-primary-rgb),0.3))', 'drop-shadow(0 0 15px rgba(var(--theme-primary-rgb),0.8))', 'drop-shadow(0 0 5px rgba(var(--theme-primary-rgb),0.3))'] 
          }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="text-primary bg-primary/10 p-3.5 rounded-2xl border border-primary/20 relative"
        >
          <Flame className="w-8 h-8 fill-current drop-shadow-md" />
          
          {/* Flame particles */}
          {streak > 0 && (
            <>
              <motion.div 
                className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ y: [0, -20], opacity: [1, 0], scale: [1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1, ease: 'easeOut', delay: 0.2 }}
              />
              <motion.div 
                className="absolute top-3 right-2 w-2 h-2 rounded-full bg-accent"
                animate={{ y: [0, -25], opacity: [1, 0], scale: [1, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeOut', delay: 0.5 }}
              />
              <motion.div 
                className="absolute top-1 left-1/2 w-1.5 h-1.5 rounded-full bg-primary-light"
                animate={{ y: [0, -15], opacity: [1, 0], scale: [1, 0.8] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'easeOut', delay: 0.8 }}
              />
            </>
          )}
        </motion.div>
      </div>

      <div className="flex flex-col gap-2 mt-1 relative z-10">
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 relative group">
              <div
                className={`w-full aspect-square rounded-xl flex items-center justify-center font-bold text-xs border transition-all duration-300 ${
                  day.active
                    ? 'bg-gradient-to-br from-primary to-accent text-white border-transparent shadow-[0_2px_10px_rgba(var(--theme-primary-rgb),0.3)]'
                    : day.isCurrent
                    ? 'bg-surface border-primary/50 text-primary shadow-[inset_0_0_10px_rgba(var(--theme-primary-rgb),0.1)]'
                    : 'bg-bg-secondary border-border text-text-muted/50'
                }`}
              >
                {day.active ? (
                  <Flame className="w-4 h-4 fill-current drop-shadow-sm" />
                ) : (
                  day.label
                )}
              </div>
              <span className={`text-[9px] font-bold ${day.isCurrent ? 'text-primary' : 'text-text-muted'}`}>{day.label}</span>
            </div>
          ))}
        </div>
        
        {/* Next milestone indicator */}
        {streak > 0 && (
          <div className="flex justify-between items-center mt-2 text-[10px] font-bold text-text-muted bg-bg-secondary/50 rounded-lg px-2 py-1">
            <span>До цели {nextMilestone} дн.</span>
            <span className="text-primary">{nextMilestone - streak} дн. осталось</span>
          </div>
        )}
      </div>
    </Card>
  );
};
export default StreakCard;
