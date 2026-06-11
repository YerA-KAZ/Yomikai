import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './widgets/Layout/MainLayout';
import HomePage from './pages/HomePage';
import HiraganaPage from './pages/HiraganaPage';
import KatakanaPage from './pages/KatakanaPage';
import KanjiPage from './pages/KanjiPage';
import DictionaryPage from './pages/DictionaryPage';
import PracticePage from './pages/PracticePage';
import TestsPage from './pages/TestsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

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
        path: 'hiragana',
        element: <HiraganaPage />,
      },
      {
        path: 'katakana',
        element: <KatakanaPage />,
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
