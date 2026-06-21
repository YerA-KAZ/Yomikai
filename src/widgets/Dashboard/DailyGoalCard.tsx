import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2 } from 'lucide-react';
import { Card } from '../../shared/ui/Card';

interface DailyGoalCardProps {
  dailyXp: number;
  dailyGoal: number;
}

export const DailyGoalCard: React.FC<DailyGoalCardProps> = ({ dailyXp, dailyGoal }) => {
  const percentage = Math.min(Math.round((dailyXp / dailyGoal) * 100), 100);
  const isCompleted = percentage >= 100;
  
  // Confetti particles state
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isCompleted) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  // Motivational message without emojis
  let message = 'Продолжай в том же духе!';
  if (isCompleted) {
    message = 'Дневная цель достигнута! Отличная работа!';
  } else if (percentage >= 75) {
    message = 'Еще один рывок и цель в кармане!';
  } else if (percentage >= 50) {
    message = 'Полпути пройдено, не останавливайся!';
  }

  // SVG Circle geometry
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Generate random confetti particles
  const confettiParticles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 200,
    y: (Math.random() - 0.5) * 200,
    color: ['bg-primary', 'bg-accent', 'bg-emerald-400', 'bg-blue-400'][Math.floor(Math.random() * 4)],
    size: Math.random() * 6 + 4,
  }));

  return (
    <Card hoverable className="p-5 flex flex-col gap-4 relative overflow-hidden">
      {/* Confetti Animation Layer */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 overflow-hidden">
            {confettiParticles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{ 
                  x: p.x, 
                  y: p.y, 
                  opacity: 0,
                  scale: p.size / 5,
                  rotate: Math.random() * 360
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`absolute w-2 h-2 rounded-sm ${p.color}`}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 relative z-10">
        {/* Circular Progress instead of linear */}
        <div className="relative flex items-center justify-center w-16 h-16 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
            <circle
              cx="32"
              cy="32"
              r={radius}
              className="stroke-bg-secondary fill-none"
              strokeWidth="5"
            />
            <motion.circle
              cx="32"
              cy="32"
              r={radius}
              className={`fill-none ${isCompleted ? 'stroke-emerald-500' : 'stroke-primary'}`}
              strokeWidth="5"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex items-center justify-center">
            {isCompleted ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.5 }}
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-500 drop-shadow-md" />
              </motion.div>
            ) : (
              <Target className="w-5 h-5 text-primary" />
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-sm font-extrabold text-text uppercase tracking-wide">Дневная цель</h3>
          
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className={`text-xl font-black ${isCompleted ? 'text-emerald-500' : 'text-primary'}`}>
              {dailyXp}
            </span>
            <span className="text-xs font-bold text-text-muted">/ {dailyGoal} XP</span>
          </div>
          
          <span className="text-[10px] text-text-secondary font-semibold mt-1 leading-snug">
            {message}
          </span>
        </div>
      </div>
    </Card>
  );
};
export default DailyGoalCard;
