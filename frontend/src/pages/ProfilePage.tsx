import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Flame, Footprints, BookOpen, PenTool, Clock, Calendar, CheckCircle2, X } from 'lucide-react';
import { useUserStore } from '../features/user/useUserStore';
import { userApi } from '../services/api/userApi';
import { Card } from '../shared/ui/Card';
import { ProgressBar } from '../shared/ui/ProgressBar';
import { Badge } from '../shared/ui/Badge';
import { Button } from '../shared/ui/Button';
import { ProgressCard } from '../widgets/Dashboard/ProgressCard';
import { leaderboardApi, type LeaderboardLeague } from '../services/api/leaderboardApi';

export const ProfilePage: React.FC = () => {
  const { user, stats, fetchUser } = useUserStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [league, setLeague] = useState<LeaderboardLeague | null>(null);

  React.useEffect(() => {
    let mounted = true;
    leaderboardApi.getWeekly().then(res => {
      if (mounted) setLeague(res.league);
    }).catch(console.error);
    return () => { mounted = false; };
  }, []);

  const openEditModal = () => {
    if (user) {
      setEditName(user.name);
      setEditAvatar(user.avatar);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await userApi.updateProfile({ name: editName, avatar: editAvatar });
      await fetchUser();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user || !stats) {
    return (
      <div className="flex flex-col gap-6 py-4 md:py-6 w-full">
        <div className="h-[200px] bg-surface/50 border border-border/10 rounded-[2rem] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[1, 2, 3, 4].map(i => (
             <div key={i} className="h-28 bg-surface/50 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
             </div>
           ))}
        </div>
        <div className="flex flex-col gap-4 mt-2">
          <div className="h-8 w-48 bg-surface/50 rounded-xl relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-[100px] bg-surface/50 rounded-2xl relative overflow-hidden border border-border/5">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getAchievementIcon = (iconName: string, isUnlocked: boolean) => {
    const iconClass = isUnlocked ? 'text-amber-500 w-6 h-6 drop-shadow-sm' : 'text-text-muted/50 w-6 h-6';
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <Card className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-surface to-bg-secondary/40 border-border/10 overflow-hidden relative">
          
          {/* Decorative background circle */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left w-full md:w-auto relative z-10">
            {/* Avatar Container with Animated Ring */}
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary to-accent p-[3px] shadow-lg shadow-primary/20 transform group-hover:scale-105 transition-transform duration-300 overflow-hidden relative">
                <div className="w-full h-full rounded-[1.8rem] bg-surface flex items-center justify-center font-black text-4xl text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent font-jp shadow-inner overflow-hidden">
                  {user.avatar.startsWith('/') || user.avatar.startsWith('http') ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
              </div>
            </div>

            {/* User Meta */}
            <div className="flex flex-col">
              <div className="flex items-center flex-col md:flex-row gap-2.5">
                <h2 className="text-3xl font-black drop-shadow-sm">{user.name}</h2>
                {league && (
                  <Badge variant="info" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-black uppercase tracking-wider text-[10px]">
                    {league.name}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-2 text-xs font-bold text-text-muted justify-center md:justify-start">
                <Calendar className="w-4 h-4" />
                <span>В Yomikai с {joinDate}</span>
              </div>

              {/* Level and XP Meter */}
              <div className="flex flex-col w-full md:w-72 gap-2 mt-5">
                <div className="flex justify-between items-end text-xs font-bold text-text-secondary">
                  <span className="text-primary uppercase font-black text-[11px] tracking-widest bg-primary/10 px-2 py-0.5 rounded-md">Уровень {user.level}</span>
                  <span className="font-black text-text">{user.xp} / {user.xpToNextLevel} XP</span>
                </div>
                <ProgressBar value={user.xp} max={user.xpToNextLevel} height="md" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto relative z-10">
            {localStorage.getItem('user_role') === 'admin' && (
              <Button
                variant="primary"
                size="md"
                className="rounded-xl font-bold w-full shadow-md bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-0"
                onClick={() => window.location.href = '/admin'}
              >
                Админ Панель
              </Button>
            )}
            <Button
              variant="secondary"
              size="md"
              className="rounded-xl font-bold w-full border-border/20 shadow-sm"
              onClick={openEditModal}
            >
              Редактировать
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Expanded Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Award className="w-7 h-7" />, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Опыт', value: `${stats.totalXp} XP` },
          { icon: <Flame className="w-7 h-7" />, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20', label: 'Ударный режим', value: `${user.streak} дней` },
          { icon: <BookOpen className="w-7 h-7" />, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Слов выучено', value: `${stats.wordsLearned} слов` },
          { icon: <Clock className="w-7 h-7" />, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Время учебы', value: `${Math.round(stats.totalStudyTime / 60)} часов` },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + idx * 0.05, type: 'spring' }}
          >
            <Card hoverable className="p-5 flex flex-col gap-3 items-center justify-center text-center h-full group bg-surface/60 border-border/10">
              <div className={`p-3 rounded-2xl border transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-widest">{stat.label}</span>
                <span className="text-xl font-black mt-0.5 text-text">{stat.value}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, type: 'spring' }}
      >
        <ProgressCard
          learnedKana={user.learnedKana}
          learnedKanji={user.learnedKanji}
          learnedWords={user.learnedWords}
        />
      </motion.div>

      {/* Achievements List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-text">Награды и достижения</h3>
          <span className="text-xs font-bold text-text-muted bg-surface py-1 px-3 rounded-xl border border-border/10">
            {user.achievements.filter(a => a.progress >= a.maxProgress).length} / {user.achievements.length}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.achievements.map((achievement, idx) => {
            const isCompleted = achievement.progress >= achievement.maxProgress;
            const progressPercent = Math.min((achievement.progress / achievement.maxProgress) * 100, 100);

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
              >
                <Card
                  hoverable
                  className={`p-4 flex gap-4 items-center border transition-all duration-300 group ${
                    isCompleted 
                      ? 'border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-amber-500/5 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]' 
                      : 'border-border/15 bg-surface/50 hover:border-primary/30'
                  }`}
                >
                  {/* Icon Circle */}
                  <div
                    className={`p-4 rounded-2xl border flex-shrink-0 transition-transform duration-500 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-amber-400/20 to-amber-600/20 border-amber-500/30 shadow-md shadow-amber-500/20 group-hover:scale-110 group-hover:rotate-[15deg]'
                        : 'bg-bg-secondary border-border/15 group-hover:border-primary/20'
                    }`}
                  >
                    {getAchievementIcon(achievement.icon, isCompleted)}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col gap-1.5 min-w-0 pr-2">
                    <div className="flex justify-between items-start gap-1.5">
                      <span className={`text-base font-black truncate ${isCompleted ? 'text-amber-500' : 'text-text group-hover:text-primary transition-colors'}`}>
                        {achievement.title}
                      </span>
                      {isCompleted && (
                        <span className="text-[9px] font-black text-amber-600 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <CheckCircle2 className="w-3 h-3" /> Открыто
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-text-secondary leading-snug line-clamp-2 pr-4">{achievement.description}</span>
                    
                    {/* Progress bar */}
                    {!isCompleted && (
                      <div className="flex items-center gap-3 mt-2.5">
                        <div className="flex-1 bg-border/20 rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            className="bg-primary h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1, delay: 0.5 + idx * 0.1, ease: 'easeOut' }}
                          />
                        </div>
                        <span className="text-[10px] font-black text-text-muted shrink-0 min-w-[30px] text-right">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-surface border border-border/20 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-border/10">
                <h3 className="text-xl font-extrabold text-text">Редактировать профиль</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-text-muted hover:text-text transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-text-secondary">Имя пользователя</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
                    placeholder="Введите ваше имя"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-text-secondary">Аватар (ссылка)</label>
                  <input
                    type="text"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary"
                    placeholder="https://... или /avatar-default.svg"
                  />
                  <span className="text-[10px] text-text-muted">Оставьте пустым для отображения первой буквы имени</span>
                </div>
                
                <div className="mt-4 flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Отмена</Button>
                  <Button variant="primary" onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ProfilePage;
