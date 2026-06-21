import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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

// Configure App Router mapping endpoints to FSD layers
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
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
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
