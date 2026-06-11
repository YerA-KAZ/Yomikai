import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header';
import { MobileNav } from '../Sidebar/MobileNav';
import { PetContainer } from '../Pet/PetContainer';
import { useThemeStore } from '../../features/theme/useThemeStore';
import { useUserStore } from '../../features/user/useUserStore';

export const MainLayout: React.FC = () => {
  const { petTheme, colorMode } = useThemeStore();
  const { fetchUser, fetchStats } = useUserStore();

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
    <div className="min-h-screen flex flex-col font-sans theme-transition relative bg-bg text-text pb-16 md:pb-0 md:pt-16">
      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-45 paw-bg z-0" />

      {/* Header (Desktop) */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 relative z-10 overflow-x-hidden">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Interactive Pet (Cat/Dog) */}
      <PetContainer />
    </div>
  );
};
export default MainLayout;
