import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Shield, Clock, ChevronUp, ChevronDown, User, Zap, Award, Loader2 } from 'lucide-react';
import { Card } from '../shared/ui/Card';
import { Badge } from '../shared/ui/Badge';
import { leaderboardApi, type LeaderboardEntry, type LeaderboardLeague } from '../services/api/leaderboardApi';

export const LeaderboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'alltime'>('weekly');

  // Real countdown to next Sunday 23:59
  const getTimeUntilSunday = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon ... 6=Sat
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + daysUntilSunday);
    targetDate.setHours(23, 59, 0, 0);
    const diffMs = targetDate.getTime() - now.getTime();
    if (diffMs <= 0) return { days: 0, hours: 0, minutes: 0 };
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return { days, hours, minutes };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeUntilSunday);

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [league, setLeague] = useState<LeaderboardLeague | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = activeTab === 'weekly' 
          ? await leaderboardApi.getWeekly() 
          : await leaderboardApi.getAllTime();
          
        if (mounted) {
          setLeaderboardData(response.entries);
          setLeague(response.league);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to load leaderboard');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
    return () => { mounted = false; };
  }, [activeTab]);

  // Update timer every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilSunday());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const podiumUsers = leaderboardData.slice(0, 3);
  const remainingUsers = leaderboardData.slice(3);

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } }
  };

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6 text-text max-w-5xl mx-auto w-full">
      
      {/* Top Banner Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 glass p-6 rounded-[2rem] border border-glass-border shadow-xl">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-tr from-amber-400 to-amber-500 text-white p-3.5 rounded-2xl border border-amber-300/30 shadow-lg shadow-amber-500/20">
            <Trophy className="w-8 h-8 animate-bounce-subtle" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight">Таблица лидеров</h1>
              {league && (
                <Badge variant="info" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-black">
                  {league.name}
                </Badge>
              )}
            </div>
            <p className="text-text-secondary text-sm font-medium mt-1">
              Учись регулярно, зарабатывай опыт и соревнуйся с другими учениками!
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-bg-secondary/60 border border-border/10 p-1.5 rounded-2xl self-start md:self-auto shadow-inner">
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-5 py-2 rounded-xl text-xs font-black transition-all relative z-10 ${
              activeTab === 'weekly' ? 'text-white' : 'text-text-secondary hover:text-text'
            }`}
          >
            Неделя
            {activeTab === 'weekly' && (
              <motion.div
                className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-sm"
                layoutId="activeLeaderboardTab"
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('alltime')}
            className={`px-5 py-2 rounded-xl text-xs font-black transition-all relative z-10 ${
              activeTab === 'alltime' ? 'text-white' : 'text-text-secondary hover:text-text'
            }`}
          >
            Все время
            {activeTab === 'alltime' && (
              <motion.div
                className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-sm"
                layoutId="activeLeaderboardTab"
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Gamification Alert Context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/15 p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
          <div className="bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-500/30 text-emerald-500">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-xs font-bold">
            <span className="text-emerald-500 font-extrabold uppercase tracking-wide">Зона продвижения</span>
            <span className="text-text-secondary mt-0.5">Топ-3 учеников этой недели перейдут в престижную Рубиновую лигу!</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/15 p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
          <div className="bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/30 text-amber-500">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-xs font-bold">
            <span className="text-amber-500 font-extrabold uppercase tracking-wide">До конца турнира</span>
            <span className="text-text-secondary mt-0.5">
              {timeLeft.days}д {timeLeft.hours}ч {timeLeft.minutes}м
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card className="p-8 text-center border-red-500/30 bg-red-500/5">
          <p className="text-red-500 font-bold">{error}</p>
        </Card>
      ) : leaderboardData.length === 0 ? (
        <Card className="p-8 text-center text-text-secondary">
          <p>Пока нет данных.</p>
        </Card>
      ) : (
        <>
          {/* Top 3 Podium Grid */}
          <Card className="p-6 md:p-8 flex flex-col items-center justify-center border-border/10 bg-surface/40">
            <div className="flex items-end justify-center gap-4 sm:gap-8 md:gap-12 w-full max-w-xl h-[280px] mt-6 select-none">
          
          {/* #2 PLACE (Silver) */}
          {podiumUsers[1] && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '70%', opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.8, type: 'spring' as const }}
              className="flex flex-col items-center w-24 sm:w-28 h-full justify-end group cursor-pointer"
            >
              <div className="flex flex-col items-center gap-1.5 mb-2">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center font-black text-slate-800 text-lg shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                    {podiumUsers[1].avatar.startsWith('/') || podiumUsers[1].avatar.startsWith('http') ? (
                      <img src={podiumUsers[1].avatar} alt={podiumUsers[1].name} className="w-full h-full object-cover" />
                    ) : (
                      podiumUsers[1].avatar
                    )}
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 bg-slate-400 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px] border border-white">2</span>
                </div>
                <span className="text-xs font-black truncate max-w-[80px]">{podiumUsers[1].name}</span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded-md">{podiumUsers[1].xp} XP</span>
              </div>
              <div className="w-full bg-gradient-to-t from-slate-300/40 to-slate-200/50 dark:from-slate-700/30 dark:to-slate-600/40 border-t border-slate-400/30 rounded-t-2xl flex-1 flex flex-col items-center justify-center shadow-lg">
                <span className="text-2xl font-black text-slate-400 dark:text-slate-500 tracking-wider">II</span>
              </div>
            </motion.div>
          )}

          {/* #1 PLACE (Gold) */}
          {podiumUsers[0] && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '90%', opacity: 1 }}
              transition={{ duration: 0.8, type: 'spring' as const }}
              className="flex flex-col items-center w-28 sm:w-32 h-full justify-end group cursor-pointer"
            >
              <div className="flex flex-col items-center gap-1.5 mb-2">
                <div className="relative">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-500 group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center font-black text-amber-800 text-2xl shadow-xl shadow-amber-500/10 group-hover:scale-105 transition-transform overflow-hidden">
                    {podiumUsers[0].avatar.startsWith('/') || podiumUsers[0].avatar.startsWith('http') ? (
                      <img src={podiumUsers[0].avatar} alt={podiumUsers[0].name} className="w-full h-full object-cover" />
                    ) : (
                      podiumUsers[0].avatar
                    )}
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px] border border-white">1</span>
                </div>
                <span className="text-sm font-black truncate max-w-[100px] text-amber-500">{podiumUsers[0].name}</span>
                <span className="text-xs font-black text-amber-600 bg-amber-500/10 px-2.5 py-0.5 rounded-md">{podiumUsers[0].xp} XP</span>
              </div>
              <div className="w-full bg-gradient-to-t from-amber-400/40 to-amber-300/50 dark:from-amber-600/30 dark:to-amber-500/40 border-t border-amber-400/30 rounded-t-2xl flex-1 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full animate-shine" />
                <span className="text-3xl font-black text-amber-500 dark:text-amber-400 tracking-wider">I</span>
              </div>
            </motion.div>
          )}

          {/* #3 PLACE (Bronze) */}
          {podiumUsers[2] && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '55%', opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: 'spring' as const }}
              className="flex flex-col items-center w-24 sm:w-28 h-full justify-end group cursor-pointer"
            >
              <div className="flex flex-col items-center gap-1.5 mb-2">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-orange-100 border-2 border-orange-200 flex items-center justify-center font-black text-orange-800 text-lg shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                    {podiumUsers[2].avatar.startsWith('/') || podiumUsers[2].avatar.startsWith('http') ? (
                      <img src={podiumUsers[2].avatar} alt={podiumUsers[2].name} className="w-full h-full object-cover" />
                    ) : (
                      podiumUsers[2].avatar
                    )}
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px] border border-white">3</span>
                </div>
                <span className="text-xs font-black truncate max-w-[80px]">{podiumUsers[2].name}</span>
                <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md">{podiumUsers[2].xp} XP</span>
              </div>
              <div className="w-full bg-gradient-to-t from-orange-300/40 to-orange-200/50 dark:from-orange-700/30 dark:to-orange-600/40 border-t border-orange-300/30 rounded-t-2xl flex-1 flex flex-col items-center justify-center shadow-md">
                <span className="text-2xl font-black text-orange-400 dark:text-orange-600/70 tracking-wider">III</span>
              </div>
            </motion.div>
          )}

        </div>
      </Card>

      {/* Main Leaderboard List */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-bold text-text-secondary px-1">Таблица участников</h3>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-2.5 w-full"
        >
          {remainingUsers.map((item) => {
            const isTopZone = item.rank <= 3; // podium
            const isRelegationZone = item.rank >= leaderboardData.length - 3; // Let's make bottom 3 the relegation zone, or rank >= 8 if length is 10. Let's use rank >= 8 to be safe as previously defined.
            const relegationStyle = item.rank >= 8;

            return (
              <motion.div 
                key={item.rank}
                variants={itemVariants}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                  item.isCurrentUser
                    ? 'bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/40 ring-1 ring-primary/20 shadow-md'
                    : relegationStyle
                    ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/30'
                    : 'bg-surface/50 border-border/10 hover:bg-surface hover:border-border/20 hover:scale-[1.005]'
                }`}
              >
                {/* User Left: Rank & Avatar & Name */}
                <div className="flex items-center gap-4">
                  {/* Rank number */}
                  <span className={`w-6 text-center text-sm font-black ${
                    item.isCurrentUser ? 'text-primary' : 'text-text-muted'
                  }`}>
                    {item.rank}
                  </span>

                  {/* Avatar badge */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-inner overflow-hidden ${
                    item.isCurrentUser 
                      ? 'bg-primary text-white' 
                      : 'bg-bg-secondary text-text-secondary border border-border/10'
                  }`}>
                    {item.avatar.startsWith('/') || item.avatar.startsWith('http') ? (
                      <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      item.avatar
                    )}
                  </div>

                  {/* Username & Level */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-black ${item.isCurrentUser ? 'text-primary' : 'text-text'}`}>
                        {item.name}
                      </span>
                      {item.isCurrentUser && (
                        <Badge variant="success" className="text-[9px] py-0.5 px-1.5 font-bold">
                          Вы
                        </Badge>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                      Уровень {item.level}
                    </span>
                  </div>
                </div>

                {/* User Right: Streak & XP */}
                <div className="flex items-center gap-6">
                  {/* Streak Day Counter */}
                  {item.streak > 0 && (
                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-text-secondary bg-bg-secondary px-2.5 py-1 rounded-xl border border-border/10">
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                      <span>{item.streak} дн</span>
                    </div>
                  )}

                  {/* XP Count badge */}
                  <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border font-black text-xs ${
                    item.isCurrentUser
                      ? 'bg-primary/20 text-primary border-primary/25'
                      : 'bg-bg-secondary/40 text-text border-border/10'
                  }`}>
                    {item.xp} <span className="text-[10px] text-text-muted font-bold">XP</span>
                  </div>

                  {/* Trend Indicator */}
                  <div className="w-4 flex justify-center text-text-muted">
                    {relegationStyle ? (
                      <ChevronDown className="w-4 h-4 text-red-500" />
                    ) : (
                      <span className="text-xs font-bold">-</span>
                    )}
                  </div>
                </div>

              </motion.div>
            );
          })}
        </motion.div>
      </div>
        </>
      )}

    </div>
  );
};

export default LeaderboardPage;
