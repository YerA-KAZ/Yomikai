import React from 'react';
import { Target } from 'lucide-react';
import { Card } from '../../shared/ui/Card';
import { ProgressBar } from '../../shared/ui/ProgressBar';

interface DailyGoalCardProps {
  dailyXp: number;
  dailyGoal: number;
}

export const DailyGoalCard: React.FC<DailyGoalCardProps> = ({ dailyXp, dailyGoal }) => {
  const percentage = Math.round((dailyXp / dailyGoal) * 100);

  // Motivational message
  let message = 'Продолжай в том же духе!';
  if (percentage >= 100) {
    message = 'Дневная цель достигнута! Отличная работа! 🎉';
  } else if (percentage >= 75) {
    message = 'Еще один рывок и цель в кармане!';
  } else if (percentage >= 50) {
    message = 'Полпути пройдено, не останавливайся!';
  }

  return (
    <Card hoverable className="p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="text-primary bg-primary/10 p-2.5 rounded-xl border border-primary/20">
          <Target className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-text">Дневная цель</h3>
          <span className="text-xs text-text-muted font-medium">{message}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mt-2">
        <div className="flex justify-between items-center text-sm font-bold text-text-secondary">
          <span>Очки опыта (XP)</span>
          <span className="text-primary">{dailyXp} / {dailyGoal} XP</span>
        </div>
        <ProgressBar value={dailyXp} max={dailyGoal} height="md" />
      </div>
    </Card>
  );
};
export default DailyGoalCard;
