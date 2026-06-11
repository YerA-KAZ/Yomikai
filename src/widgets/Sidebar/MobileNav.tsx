import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Languages, BookOpen, GraduationCap, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Главная', path: '/', icon: Home },
    { name: 'Азбука', path: '/hiragana', icon: Languages },
    { name: 'Практика', path: '/practice', icon: GraduationCap },
    { name: 'Словарь', path: '/dictionary', icon: BookOpen },
    { name: 'Профиль', path: '/profile', icon: User },
  ];

  return (
    <motion.div
      className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass z-50 border-t border-glass-border flex items-center justify-around px-2 pb-safe theme-transition"
      initial={{ y: 64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {navItems.map((item) => {
        const isActive =
          item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center flex-1 h-full relative"
          >
            <motion.div
              animate={isActive ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
              className={`p-1.5 rounded-xl transition-colors ${
                isActive ? 'text-primary' : 'text-text-muted hover:text-text'
              }`}
            >
              <Icon size={22} />
            </motion.div>
            <span
              className={`text-[10px] font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-text-muted'
              }`}
            >
              {item.name}
            </span>
            {isActive && (
              <motion.div
                className="absolute bottom-1 w-1 h-1 rounded-full bg-primary"
                layoutId="activeMobileDot"
              />
            )}
          </Link>
        );
      })}
    </motion.div>
  );
};
export default MobileNav;
