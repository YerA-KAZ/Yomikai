import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '../features/user/useUserStore';
import { WelcomeCard } from '../widgets/Dashboard/WelcomeCard';
import { ProgressCard } from '../widgets/Dashboard/ProgressCard';
import { StreakCard } from '../widgets/Dashboard/StreakCard';
import { DailyGoalCard } from '../widgets/Dashboard/DailyGoalCard';
import { RecentLessons } from '../widgets/Dashboard/RecentLessons';
import { AchievementsCard } from '../widgets/Dashboard/AchievementsCard';
import { StatsCard } from '../widgets/Dashboard/StatsCard';

export const HomePage: React.FC = () => {
  const { user, stats, isLoading, error, fetchUser, fetchStats } = useUserStore();

  useEffect(() => {
    fetchUser();
    fetchStats();
  }, [fetchUser, fetchStats]);

  if (isLoading && !user) {
    return (
      <div className="flex flex-col gap-6 py-6 animate-pulse">
        {/* Welcome Skeleton */}
        <div className="h-32 bg-surface/50 border border-border/10 rounded-3xl" />
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-44 bg-surface/50 border border-border/10 rounded-3xl" />
          <div className="h-44 bg-surface/50 border border-border/10 rounded-3xl" />
          <div className="h-44 bg-surface/50 border border-border/10 rounded-3xl" />
          <div className="h-44 bg-surface/50 border border-border/10 rounded-3xl" />
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
          className="bg-primary text-white font-bold px-6 py-2.5 rounded-2xl hover:bg-primary-dark transition-colors"
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as any, stiffness: 260, damping: 25 } },
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

      {/* Main Grid content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col (2/3 width on large screens) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <motion.div variants={itemVariants}>
            <RecentLessons lessons={user.recentLessons} />
          </motion.div>

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

          <motion.div variants={itemVariants}>
            <ProgressCard
              learnedKana={user.learnedKana}
              learnedKanji={user.learnedKanji}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <AchievementsCard achievements={user.achievements} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
export default HomePage;
