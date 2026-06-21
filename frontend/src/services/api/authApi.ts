import { apiPost } from './client';
import type { User, Achievement, RecentLesson } from '../../entities/user/types';

export interface AuthUser extends User {
  role: 'user' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}

export const authApi = {
  login: (input: LoginInput) => apiPost<AuthResponse>('/api/auth/login', input),
  register: (input: RegisterInput) => apiPost<AuthResponse>('/api/auth/register', input),
};

export type { Achievement, RecentLesson };
