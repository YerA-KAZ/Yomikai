import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Sun, Moon, Home, Languages, BookOpen, GraduationCap, Award, Settings, Search, ChevronDown, Trophy, Database, LogOut, type LucideIcon } from 'lucide-react';
import { useThemeStore } from '../../features/theme/useThemeStore';

type NavItem = {
  name: string;
  path: string;
  icon: LucideIcon;
  children?: {
    name: string;
    path: string;
  }[];
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

export const Header: React.FC = () => {
  const { petTheme, colorMode, setPetTheme, toggleColorMode } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navGroups: NavGroup[] = [
    {
      title: 'Обучение',
      items: [
        {
          name: 'Азбука',
          path: '/alphabet',
          icon: Languages,
          children: [
            { name: 'Хирагана', path: '/alphabet/hiragana' },
            { name: 'Катакана', path: '/alphabet/katakana' },
          ],
        },
        { name: 'Кандзи', path: '/kanji', icon: Award },
      ]
    },
    {
      title: 'Практика',
      items: [
        { name: 'Упражнения', path: '/practice', icon: GraduationCap },
        { name: 'Тесты', path: '/tests', icon: BookOpen },
        { name: 'Лидерборд', path: '/leaderboard', icon: Trophy },
      ]
    },
    {
      title: 'Справочник',
      items: [
        { name: 'Словарь', path: '/dictionary', icon: Search },
      ]
    }
  ];

  return (
    <motion.header
      className="hidden md:flex fixed top-0 left-0 right-0 h-16 glass z-50 border-b border-glass-border items-center justify-between px-6 lg:px-8 theme-transition"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Logo */}
      <Link to="/" className="text-2xl font-extrabold tracking-wide flex items-center gap-1 group">
        <Home className="w-5 h-5 text-primary group-hover:-translate-y-1 transition-transform" />
        <span className="text-text">Yomi</span>
        <span className="text-primary group-hover:animate-pulse">kai</span>
      </Link>

      {/* Nav Menu */}
      <nav className="flex gap-8 h-full items-center">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="flex gap-4 h-full items-center relative">
            {group.items.map((link) => {
              const isActive = link.children
                ? link.children.some((child) => location.pathname.startsWith(child.path))
                : location.pathname.startsWith(link.path);
              const Icon = link.icon;
              return (
                <div key={link.path} className="relative h-full flex items-center group">
                  <Link
                    to={link.path}
                    className={`relative text-sm font-bold h-full flex items-center gap-1.5 px-2 transition-all whitespace-nowrap ${
                      isActive ? 'text-primary' : 'text-text-secondary hover:text-text'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary animate-pulse-subtle' : 'text-text-muted'}`} />
                    {link.name}
                    {link.children && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform group-hover:rotate-180 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
                    )}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-primary shadow-[0_-2px_10px_rgba(var(--theme-primary-rgb),0.5)]"
                        layoutId="activeHeaderTab"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>

                  {link.children && (
                    <div className="absolute left-1/2 top-full z-50 w-44 -translate-x-1/2 pt-2 opacity-0 pointer-events-none translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0">
                      <div className="glass border border-glass-border rounded-2xl p-2 shadow-xl flex flex-col gap-1">
                        {link.children.map((child) => {
                          const childActive = location.pathname.startsWith(child.path);
                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
                                childActive
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-text-secondary hover:text-text hover:bg-surface-hover'
                              }`}
                            >
                              <span>{child.name}</span>
                              {childActive && <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--theme-primary-rgb),0.8)]" />}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Control Actions */}
      <div className="flex items-center gap-2 lg:gap-3">


        {/* Light/Dark Toggle */}
        <button
          onClick={toggleColorMode}
          className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-hover transition-colors border border-transparent relative overflow-hidden group"
          title={colorMode === 'light' ? 'Темная тема' : 'Светлая тема'}
        >
          {colorMode === 'light' ? (
            <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
          ) : (
            <Sun className="w-5 h-5 group-hover:rotate-45 transition-transform text-amber-400" />
          )}
        </button>

        {/* Settings */}
        <button
          onClick={() => navigate('/settings')}
          className={`p-2 rounded-xl transition-colors border border-transparent group ${
            location.pathname === '/settings' ? 'bg-bg-secondary text-primary' : 'text-text-muted hover:text-text hover:bg-surface-hover'
          }`}
          title="Настройки"
        >
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
        </button>

        {/* Profile / Admin Dashboard */}
        <button
          onClick={() => {
            if (localStorage.getItem('user_role') === 'admin') {
              navigate('/admin');
            } else {
              navigate('/profile');
            }
          }}
          className={`p-2 rounded-xl transition-colors border border-transparent relative overflow-hidden group ${
            location.pathname === '/profile' || location.pathname === '/admin' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface border-border/50 hover:bg-surface-hover text-text'
          }`}
          title={localStorage.getItem('user_role') === 'admin' ? 'Профиль Администратора' : 'Профиль пользователя'}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <User className="w-5 h-5 relative z-10" />
        </button>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_role');
            window.location.href = '/welcome'; // Hard reload to clear states
          }}
          className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors border border-transparent group"
          title="Выйти"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.header>
  );
};
export default Header;
