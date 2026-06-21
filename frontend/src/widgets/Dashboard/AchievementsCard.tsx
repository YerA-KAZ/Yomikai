import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    const iconClass = isUnlocked ? 'text-amber-500 drop-shadow-sm' : 'text-text-muted/50';
    switch (iconName) {
      case 'footprints': return <Footprints className={iconClass} />;
      case 'flame': return <Flame className={iconClass} />;
      case 'award': return <Award className={iconClass} />;
      case 'book-open': return <BookOpen className={iconClass} />;
      case 'pen-tool': return <PenTool className={iconClass} />;
      default: return <Award className={iconClass} />;
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
        {dashboardAchievements.map((achievement, idx) => {
          const isCompleted = achievement.progress >= achievement.maxProgress;
          const progressPercentage = Math.min((achievement.progress / achievement.maxProgress) * 100, 100);
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all ${
                isCompleted
                  ? 'bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-amber-500/30 shadow-[inset_0_0_15px_rgba(245,158,11,0.05)]'
                  : 'bg-bg-secondary/40 border-border/10'
              }`}
            >
              {/* Icon Container */}
              <div
                className={`p-3 rounded-xl border flex-shrink-0 relative overflow-hidden ${
                  isCompleted
                    ? 'bg-amber-500/20 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-bg-secondary border-border/15'
                }`}
              >
                {isCompleted && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent w-[200%]"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', delay: Math.random() * 2 }}
                  />
                )}
                {getAchievementIcon(achievement.icon, isCompleted)}
              </div>

              {/* Text info */}
              <div className="flex-1 flex flex-col min-w-0 justify-center">
                <div className="flex items-center gap-1.5 justify-between">
                  <span className={`text-sm font-bold truncate ${isCompleted ? 'text-amber-500' : 'text-text'}`}>
                    {achievement.title}
                  </span>
                  {!isCompleted && <Lock className="w-3.5 h-3.5 text-text-muted/50" />}
                </div>
                <span className="text-xs text-text-secondary truncate mt-0.5">{achievement.description}</span>
                
                {/* Micro progress bar for incomplete achievements */}
                {!isCompleted && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-border/20 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        className="bg-primary h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + idx * 0.1, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-text-muted w-6 text-right">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};
export default AchievementsCard;
