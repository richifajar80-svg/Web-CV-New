import { CVData } from './cv';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isVerified?: boolean;
  isPaid?: boolean;
  role?: 'admin' | 'user';
  subscriptionExpiresAt?: string;
  avatarUrl?: string;
}

export interface SavedCV {
  id: string;
  title: string;
  updatedAt: string;
  data: CVData;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
