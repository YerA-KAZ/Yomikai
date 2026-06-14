import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '../Header/Header';
import { MobileNav } from '../Sidebar/MobileNav';
import { PetContainer } from '../Pet/PetContainer';
import { useThemeStore } from '../../features/theme/useThemeStore';
import { useUserStore } from '../../features/user/useUserStore';

// Decorative background kana characters
const floatingKana = [
  { char: 'あ', size: 'text-6xl', left: '10%', top: '20%', delay: 0, duration: 25 },
  { char: 'カ', size: 'text-8xl', left: '85%', top: '15%', delay: 2, duration: 28 },
  { char: '漢', size: 'text-9xl', left: '75%', top: '75%', delay: 5, duration: 35 },
  { char: 'の', size: 'text-5xl', left: '15%', top: '80%', delay: 1, duration: 22 },
  { char: '語', size: 'text-7xl', left: '5%', top: '50%', delay: 8, duration: 30 },
  { char: 'ツ', size: 'text-6xl', left: '90%', top: '50%', delay: 4, duration: 26 },
];

export const MainLayout: React.FC = () => {
  const { petTheme, colorMode } = useThemeStore();
  const { fetchUser, fetchStats } = useUserStore();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Apply theme classes to <html> tag
  useEffect(() => {
    const root = document.documentElement;
    
    // Reset classes
    root.classList.remove('cat-theme', 'dog-theme', 'light', 'dark');
    
    // Add active classes
    root.classList.add(`${petTheme}-theme`);
    root.classList.add(colorMode);
    
    // Force background color transition matching theme
    root.style.backgroundColor = colorMode === 'dark' ? '#0F0F1A' : '#FFF8F0';
  }, [petTheme, colorMode]);

  // Load user data on mount
  useEffect(() => {
    fetchUser();
    fetchStats();
  }, [fetchUser, fetchStats]);

  return (
    <div className="min-h-screen flex flex-col font-sans theme-transition relative bg-bg text-text pb-20 md:pb-0 md:pt-16">
      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 transition-opacity duration-1000" style={{ backgroundImage: 'radial-gradient(var(--theme-text) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="fixed inset-0 pointer-events-none opacity-45 paw-bg z-0" />
      
      {/* Floating background particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {floatingKana.map((item, idx) => (
          <motion.div
            key={idx}
            className={`absolute font-jp font-black text-text-muted opacity-5 select-none ${item.size}`}
            style={{ left: item.left, top: item.top }}
            animate={{
              y: [0, -100, 0],
              x: [0, 30, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {item.char}
          </motion.div>
        ))}
      </div>

      {/* Header (Desktop) */}
      <Header />

      {/* Main Content Area with Page Transitions */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-5 sm:px-6 lg:px-8 xl:px-10 py-5 md:py-8 relative z-10 overflow-x-hidden min-h-[calc(100vh-64px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Interactive Pet (Cat/Dog) - Hidden for now, to be used on landing page later */}
      {/* {location.pathname === '/' && <PetContainer />} */}
    </div>
  );
};
export default MainLayout;
