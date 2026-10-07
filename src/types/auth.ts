import { CVData } from './cv';

export type UserPlan = 'personal' | 'enterprise';

export interface UserQuotaLimits {
  downloadLimit: number;
  translateLimit: number;
}

export const PLAN_LIMITS: Record<UserPlan, UserQuotaLimits> = {
  personal: {
    downloadLimit: 10,
    translateLimit: 5,
  },
  enterprise: {
    downloadLimit: 100,
    translateLimit: 25,
  },
};

export const PLAN_PRICES: Record<UserPlan, number> = {
  personal: 25000,
  enterprise: 199000,
};

export interface UserQuotaInfo {
  plan: UserPlan;
  downloadsUsed: number;
  downloadLimit: number;
  translatesUsed: number;
  translateLimit: number;
  resetMonth: string;
}

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
  plan?: UserPlan;
  downloadCountThisMonth?: number;
  translateCountThisMonth?: number;
  lastQuotaResetMonth?: string;
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
