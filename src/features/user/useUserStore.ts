import { create } from 'zustand';
import type { User, UserStats } from '../../entities/user/types';
import { userApi } from '../../services/api/userApi';

interface UserState {
  user: User | null;
  stats: UserStats | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  fetchStats: () => Promise<void>;
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  stats: null,
  isLoading: false,
  error: null,
  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await userApi.getMe();
      set({ user, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  fetchStats: async () => {
    try {
      const stats = await userApi.getStats();
      set({ stats });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));
