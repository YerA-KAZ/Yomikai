import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Languages, GraduationCap, BookOpen, MoreHorizontal, Award, Settings, User, Trophy } from 'lucide-react';
import { useThemeStore } from '../../features/theme/useThemeStore';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);
  const { toggleColorMode } = useThemeStore();

  const mainNavItems = [
    { name: 'Главная', path: '/', icon: Home, exact: true },
    { name: 'Азбука', path: '/alphabet', icon: Languages, activePaths: ['/alphabet', '/hiragana', '/katakana'] },
    { name: 'Практика', path: '/practice', icon: GraduationCap },
    { name: 'Словарь', path: '/dictionary', icon: BookOpen },
  ];

  const moreNavItems = [
    { name: 'Кандзи', path: '/kanji', icon: Award },
    { name: 'Лидерборд', path: '/leaderboard', icon: Trophy },
    { name: 'Профиль', path: '/profile', icon: User },
    { name: 'Настройки', path: '/settings', icon: Settings },
  ];

  // Haptic feedback simulation
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <>
      {/* Overlay for More Menu */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMore(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* More Menu Dropup */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="md:hidden fixed bottom-20 left-4 right-4 z-40 glass border border-glass-border rounded-3xl p-4 shadow-2xl flex flex-col gap-2"
          >
            {moreNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    triggerHaptic();
                    setShowMore(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${
                    isActive ? 'bg-primary/10 text-primary font-bold' : 'text-text-secondary hover:bg-surface-hover'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-primary/20' : 'bg-bg-secondary'}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
            
            <div className="h-[1px] bg-border/20 my-1" />
            
            <button
              onClick={() => {
                triggerHaptic();
                toggleColorMode();
                setShowMore(false);
              }}
              className="flex items-center gap-3 p-3 rounded-2xl transition-colors text-text-secondary hover:bg-surface-hover"
            >
              <div className="p-2 rounded-xl bg-bg-secondary">
                <Settings size={20} />
              </div>
              <span className="text-sm">Сменить тему</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] glass z-50 border-t border-glass-border flex items-center justify-around px-2 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)] theme-transition"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
      >
        {mainNavItems.map((item) => {
          const activePaths = 'activePaths' in item ? item.activePaths : undefined;
          const isActive = item.exact
            ? location.pathname === '/'
            : activePaths
              ? activePaths.some((path) => location.pathname.startsWith(path))
              : location.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={triggerHaptic}
              className="flex flex-col items-center justify-center flex-1 h-full relative group"
            >
              <motion.div
                animate={isActive ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-2xl transition-all duration-300 ${
                  isActive ? 'bg-primary/15 text-primary shadow-inner shadow-primary/20' : 'text-text-muted group-hover:text-text'
                }`}
              >
                <Icon size={22} className={isActive ? 'animate-pulse-subtle' : ''} />
              </motion.div>
              <span
                className={`text-[10px] font-bold mt-0.5 transition-all duration-300 ${
                  isActive ? 'text-primary' : 'text-text-muted opacity-80'
                }`}
              >
                {item.name}
              </span>
              {isActive && (
                <motion.div
                  className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--theme-primary-rgb),1)]"
                  layoutId="activeMobileDot"
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              )}
            </Link>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => {
            triggerHaptic();
            setShowMore(!showMore);
          }}
          className="flex flex-col items-center justify-center flex-1 h-full relative group"
        >
          <motion.div
            animate={showMore ? { scale: 1.15, y: -4, rotate: 90 } : { scale: 1, y: 0, rotate: 0 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-2xl transition-all duration-300 ${
              showMore ? 'bg-primary/15 text-primary shadow-inner shadow-primary/20' : 'text-text-muted group-hover:text-text'
            }`}
          >
            <MoreHorizontal size={22} />
          </motion.div>
          <span
            className={`text-[10px] font-bold mt-0.5 transition-all duration-300 ${
              showMore ? 'text-primary' : 'text-text-muted opacity-80'
            }`}
          >
            Ещё
          </span>
          {showMore && (
            <motion.div
              className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--theme-primary-rgb),1)]"
              layoutId="activeMobileDot"
            />
          )}
        </button>
      </motion.div>
    </>
  );
};
export default MobileNav;
