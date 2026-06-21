import { apiGet, apiPost } from './client';
import type { User, UserStats } from '../../entities/user/types';

export const userApi = {
  getMe: () => apiGet<User>('/api/user/me'),
  getStats: () => apiGet<UserStats>('/api/user/stats'),
  updateProfile: (data: Partial<User>) => apiPost<User>('/api/user/me', data),
};
