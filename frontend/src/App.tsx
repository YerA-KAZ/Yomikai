import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import MainLayout from './widgets/Layout/MainLayout';
import HomePage from './pages/HomePage';
import AlphabetPage from './pages/AlphabetPage';
import KanjiPage from './pages/KanjiPage';
import DictionaryPage from './pages/DictionaryPage';
import PracticePage from './pages/PracticePage';
import PracticeSessionPage from './pages/PracticeSessionPage';
import TestsPage from './pages/TestsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LandingPage from './pages/LandingPage';
import AdminPage from './pages/AdminPage';
import TestSessionPage from './pages/TestSessionPage';

// Simple Auth Guards for frontend testing
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return <Navigate to="/welcome" replace />;
  }
  return <>{children}</>;
};

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const role = localStorage.getItem('user_role');
  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// Configure App Router mapping endpoints to FSD layers
const router = createBrowserRouter([
  {
    path: '/welcome',
    element: <LandingPage />,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'alphabet/:tab?',
        element: <AlphabetPage />,
      },
      {
        path: 'hiragana',
        element: <AlphabetPage defaultTab="hiragana" />,
      },
      {
        path: 'katakana',
        element: <AlphabetPage defaultTab="katakana" />,
      },
      {
        path: 'leaderboard',
        element: <LeaderboardPage />,
      },
      {
        path: 'kanji',
        element: <KanjiPage />,
      },
      {
        path: 'dictionary',
        element: <DictionaryPage />,
      },
      {
        path: 'practice',
        element: <PracticePage />,
      },
      {
        path: 'practice/:sessionId',
        element: <PracticeSessionPage />,
      },
      {
        path: 'tests',
        element: <TestsPage />,
      },
      {
        path: 'tests/:lessonId',
        element: <TestSessionPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'admin',
        element: (
          <AdminGuard>
            <AdminPage />
          </AdminGuard>
        ),
      },
    ],
  },
]);

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
