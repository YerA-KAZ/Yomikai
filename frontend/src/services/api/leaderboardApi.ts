import { apiGet } from './client';

export interface LeaderboardLeague {
  id: string;
  name: string;
  order: number;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  weeklyXp: number;
  isCurrentUser: boolean;
}

export interface LeaderboardResponse {
  league: LeaderboardLeague;
  entries: LeaderboardEntry[];
}

export const leaderboardApi = {
  getWeekly: () => apiGet<LeaderboardResponse>('/api/leaderboard'),
  getAllTime: () => apiGet<LeaderboardResponse>('/api/leaderboard?scope=all-time'),
};
