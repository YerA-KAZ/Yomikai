import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Flame, Footprints, BookOpen, PenTool, Lock } from 'lucide-react';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import type { Achievement } from '../../entities/user/types';

interface AchievementsCardProps {
  achievements: Achievement[];
}

export const AchievementsCard: React.FC<AchievementsCardProps> = ({ achievements }) => {
  const navigate = useNavigate();

  const getAchievementIcon = (iconName: string, isUnlocked: boolean) => {
    const iconClass = isUnlocked ? 'text-amber-500' : 'text-text-muted/60';
    switch (iconName) {
      case 'footprints':
        return <Footprints className={iconClass} />;
      case 'flame':
        return <Flame className={iconClass} />;
      case 'award':
        return <Award className={iconClass} />;
      case 'book-open':
        return <BookOpen className={iconClass} />;
      case 'pen-tool':
        return <PenTool className={iconClass} />;
      default:
        return <Award className={iconClass} />;
    }
  };

  // Only show first 3 achievements on dashboard to prevent clutter
  const dashboardAchievements = achievements.slice(0, 3);

  return (
    <Card hoverable className="p-5 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-text">Достижения</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary text-xs hover:bg-transparent hover:underline"
          onClick={() => navigate('/profile')}
        >
          Смотреть все
        </Button>
      </div>

      <div className="flex flex-col gap-3.5">
        {dashboardAchievements.map((achievement) => {
          const isCompleted = achievement.progress >= achievement.maxProgress;
          return (
            <div
              key={achievement.id}
              className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all ${
                isCompleted
                  ? 'bg-amber-500/5 border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.05)]'
                  : 'bg-bg-secondary/40 border-border/10'
              }`}
            >
              {/* Icon Container */}
              <div
                className={`p-3 rounded-xl border flex-shrink-0 ${
                  isCompleted
                    ? 'bg-amber-500/10 border-amber-500/25 shadow-sm shadow-amber-500/10'
                    : 'bg-bg-secondary border-border/15'
                }`}
              >
                {getAchievementIcon(achievement.icon, isCompleted)}
              </div>

              {/* Text info */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 justify-between">
                  <span className="text-sm font-bold text-text truncate">{achievement.title}</span>
                  {!isCompleted && <Lock className="w-3 h-3 text-text-muted/60" />}
                </div>
                <span className="text-xs text-text-secondary truncate mt-0.5">{achievement.description}</span>
                {/* Micro progress bar for incomplete achievements */}
                {!isCompleted && (
                  <div className="w-full bg-border/20 rounded-full h-1 mt-2 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
export default AchievementsCard;
