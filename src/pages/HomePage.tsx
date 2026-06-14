import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '../features/user/useUserStore';
import { WelcomeCard } from '../widgets/Dashboard/WelcomeCard';
import { StreakCard } from '../widgets/Dashboard/StreakCard';
import { DailyGoalCard } from '../widgets/Dashboard/DailyGoalCard';
import { RecentLessons } from '../widgets/Dashboard/RecentLessons';
import { StatsCard } from '../widgets/Dashboard/StatsCard';

export const HomePage: React.FC = () => {
  const { user, stats, isLoading, error, fetchUser, fetchStats } = useUserStore();

  useEffect(() => {
    fetchUser();
    fetchStats();
  }, [fetchUser, fetchStats]);

  if (isLoading && !user) {
    return (
      <div className="flex flex-col gap-6 py-4 md:py-6 w-full">
        {/* Welcome Skeleton */}
        <div className="h-32 bg-surface/50 border border-border/10 rounded-[2rem] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
        </div>
        
        {/* Recent Lessons Skeleton (Full Width) */}
        <div className="h-[260px] bg-surface/50 border border-border/10 rounded-3xl relative overflow-hidden w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
        </div>
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Card Skeleton (2/3) */}
          <div className="lg:col-span-2">
            <div className="h-[380px] bg-surface/50 border border-border/10 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
            </div>
          </div>
          
          {/* Streak & Daily Goal Skeletons (1/3) */}
          <div className="flex flex-col gap-6">
            <div className="h-[200px] bg-surface/50 border border-border/10 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
            </div>
            <div className="h-[150px] bg-surface/50 border border-border/10 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="text-red-500 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-2xl font-bold">
          Ошибка загрузки данных: {error}
        </div>
        <button
          onClick={() => {
            fetchUser();
            fetchStats();
          }}
          className="bg-primary text-white font-bold px-6 py-2.5 rounded-2xl hover:bg-primary-dark transition-colors shadow-lg"
        >
          Повторить попытку
        </button>
      </div>
    );
  }

  if (!user) return null;

  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 25 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 py-4 md:py-6"
    >
      {/* Welcome Card banner */}
      <motion.div variants={itemVariants}>
        <WelcomeCard userName={user.name} level={user.level} />
      </motion.div>

      {/* Recent Lessons (Full Width) */}
      <motion.div variants={itemVariants} className="w-full">
        <RecentLessons lessons={user.recentLessons} />
      </motion.div>

      {/* Main Grid content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col (2/3 width on large screens) */}
        <div className="lg:col-span-2 flex flex-col gap-6 w-full max-w-full overflow-hidden">
          <motion.div variants={itemVariants}>
            <StatsCard stats={stats} />
          </motion.div>
        </div>

        {/* Right Col (1/3 width on large screens) */}
        <div className="flex flex-col gap-6">
          <motion.div variants={itemVariants}>
            <StreakCard streak={user.streak} longestStreak={user.longestStreak} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DailyGoalCard dailyXp={user.dailyXp} dailyGoal={user.dailyGoal} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
export default HomePage;
