import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../features/theme/useThemeStore';

export const Header: React.FC = () => {
  const { petTheme, colorMode, setPetTheme, toggleColorMode } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Главная', path: '/' },
    { name: 'Хирагана', path: '/hiragana' },
    { name: 'Катакана', path: '/katakana' },
    { name: 'Кандзи', path: '/kanji' },
    { name: 'Словарь', path: '/dictionary' },
    { name: 'Практика', path: '/practice' },
    { name: 'Тесты', path: '/tests' },
  ];

  return (
    <motion.header
      className="hidden md:flex fixed top-0 left-0 right-0 h-16 glass z-50 border-b border-glass-border items-center justify-between px-6 theme-transition"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Logo */}
      <Link to="/" className="text-2xl font-extrabold tracking-wide flex items-center gap-1">
        <span className="text-text">Yomi</span>
        <span className="text-primary">kai</span>
      </Link>

      {/* Nav Menu */}
      <nav className="flex gap-6 h-full items-center">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`relative text-[15px] font-medium h-full flex items-center px-1 transition-colors ${
                isActive ? 'text-primary' : 'text-text-secondary hover:text-text'
              }`}
            >
              {link.name}
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeHeaderTab"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Control Actions */}
      <div className="flex items-center gap-4">
        {/* Cat Theme Switcher */}
        <button
          onClick={() => setPetTheme('cat')}
          className={`p-2 rounded-xl transition-all ${
            petTheme === 'cat'
              ? 'bg-primary/20 text-primary border border-primary/30 shadow-sm scale-110'
              : 'text-text-muted hover:text-text hover:bg-surface-hover border border-transparent'
          }`}
          title="Тема Котика"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2c-3.31 0-6 2.69-6 6v3.28C5.22 11.75 4 13.73 4 16c0 3.31 2.69 6 6 6s6-2.69 6-6c0-2.27-1.22-4.25-2-4.72V8c0-3.31-2.69-6-6-6zm-3.5 8c-.83 0-1.5-.67-1.5-1.5S7.67 7 8.5 7 10 7.67 10 8.5 9.33 10 8.5 10zm7 0c-.83 0-1.5-.67-1.5-1.5S14.67 7 15.5 7s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
          </svg>
        </button>

        {/* Dog Theme Switcher */}
        <button
          onClick={() => setPetTheme('dog')}
          className={`p-2 rounded-xl transition-all ${
            petTheme === 'dog'
              ? 'bg-primary/20 text-primary border border-primary/30 shadow-sm scale-110'
              : 'text-text-muted hover:text-text hover:bg-surface-hover border border-transparent'
          }`}
          title="Тема Собачки"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </button>

        {/* Light/Dark Toggle */}
        <button
          onClick={toggleColorMode}
          className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-hover transition-colors border border-transparent"
          title={colorMode === 'light' ? 'Темная тема' : 'Светлая тема'}
        >
          {colorMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate('/profile')}
          className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-hover transition-colors border border-transparent"
          title="Профиль пользователя"
        >
          <User size={20} />
        </button>
      </div>
    </motion.header>
  );
};
export default Header;
