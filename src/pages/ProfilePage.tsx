import React from 'react';
import { Award, Flame, Footprints, BookOpen, PenTool, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { useUserStore } from '../features/user/useUserStore';
import { Card } from '../shared/ui/Card';
import { ProgressBar } from '../shared/ui/ProgressBar';
import { Badge } from '../shared/ui/Badge';
import { Button } from '../shared/ui/Button';

export const ProfilePage: React.FC = () => {
  const { user, stats } = useUserStore();

  if (!user || !stats) {
    return (
      <div className="flex flex-col gap-6 py-6 items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-text-muted font-bold text-sm">Загрузка профиля...</span>
      </div>
    );
  }

  const getAchievementIcon = (iconName: string, isUnlocked: boolean) => {
    const iconClass = isUnlocked ? 'text-amber-500 w-6 h-6' : 'text-text-muted/50 w-6 h-6';
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

  // Format date to local readable format
  const joinDate = new Date(user.joinedAt).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const xpPercent = Math.round((user.xp / user.xpToNextLevel) * 100);

  return (
    <div className="flex flex-col gap-8 py-4 md:py-6 text-text">
      {/* Profile Header */}
      <Card className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-surface to-bg-secondary/40 border-border/10">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left w-full md:w-auto">
          {/* Avatar Container */}
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent p-1 shadow-lg shadow-primary/20">
              <div className="w-full h-full rounded-2xl bg-surface flex items-center justify-center font-black text-4xl text-primary font-jp shadow-inner">
                {user.name.charAt(0)}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white w-7 h-7 rounded-xl flex items-center justify-center font-extrabold border-2 border-surface shadow text-xs">
              ✓
            </div>
          </div>

          {/* User Meta */}
          <div className="flex flex-col">
            <div className="flex items-center flex-col md:flex-row gap-2.5">
              <h2 className="text-2xl font-black">{user.name}</h2>
              <Badge variant="success" className="font-bold">Верифицирован</Badge>
            </div>
            
            <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-text-muted justify-center md:justify-start">
              <Calendar className="w-4 h-4" />
              <span>В Yomikai с {joinDate}</span>
            </div>

            {/* Level and XP Meter */}
            <div className="flex flex-col w-full md:w-64 gap-1.5 mt-4">
              <div className="flex justify-between items-end text-xs font-bold text-text-secondary">
                <span className="text-primary uppercase font-bold text-[10px] tracking-wider">Уровень {user.level}</span>
                <span>{user.xp} / {user.xpToNextLevel} XP</span>
              </div>
              <ProgressBar value={user.xp} max={user.xpToNextLevel} height="sm" />
            </div>
          </div>
        </div>

        <Button
          variant="secondary"
          size="md"
          className="rounded-xl font-bold w-full md:w-auto"
          onClick={() => alert('Редактирование профиля будет добавлено в ближайших обновлениях!')}
        >
          Редактировать
        </Button>
      </Card>

      {/* Expanded Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col gap-2 items-center justify-center text-center">
          <Award className="w-6 h-6 text-primary" />
          <span className="text-[10px] font-bold text-text-muted uppercase mt-1">Очки опыта</span>
          <span className="text-lg font-black">{stats.totalXp} XP</span>
        </Card>
        <Card className="p-4 flex flex-col gap-2 items-center justify-center text-center">
          <Flame className="w-6 h-6 text-primary" />
          <span className="text-[10px] font-bold text-text-muted uppercase mt-1">Серия дней</span>
          <span className="text-lg font-black">{user.streak} дней</span>
        </Card>
        <Card className="p-4 flex flex-col gap-2 items-center justify-center text-center">
          <BookOpen className="w-6 h-6 text-primary" />
          <span className="text-[10px] font-bold text-text-muted uppercase mt-1">Выучено слов</span>
          <span className="text-lg font-black">{stats.wordsLearned} слов</span>
        </Card>
        <Card className="p-4 flex flex-col gap-2 items-center justify-center text-center">
          <Clock className="w-6 h-6 text-primary" />
          <span className="text-[10px] font-bold text-text-muted uppercase mt-1">Время учебы</span>
          <span className="text-lg font-black">{Math.round(stats.totalStudyTime / 60)} ч</span>
        </Card>
      </div>

      {/* Achievements List */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-extrabold text-text">Все награды и достижения</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.achievements.map((achievement) => {
            const isCompleted = achievement.progress >= achievement.maxProgress;
            return (
              <Card
                key={achievement.id}
                className={`p-4 flex gap-4 items-center border transition-all ${
                  isCompleted ? 'border-amber-500/20 bg-amber-500/5' : 'border-border/10 bg-surface/30'
                }`}
              >
                {/* Icon Circle */}
                <div
                  className={`p-3.5 rounded-2xl border flex-shrink-0 ${
                    isCompleted
                      ? 'bg-amber-500/10 border-amber-500/25 shadow-sm shadow-amber-500/10'
                      : 'bg-bg-secondary border-border/15'
                  }`}
                >
                  {getAchievementIcon(achievement.icon, isCompleted)}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <div className="flex justify-between items-center gap-1.5">
                    <span className="text-sm font-bold text-text truncate">{achievement.title}</span>
                    {isCompleted && (
                      <span className="text-[9px] font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Получено
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-text-secondary leading-snug line-clamp-1">{achievement.description}</span>
                  
                  {/* Progress bar */}
                  <div className="flex items-center gap-2 mt-2.5">
                    <div className="flex-1 bg-border/20 rounded-full h-1 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-text-muted shrink-0">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
