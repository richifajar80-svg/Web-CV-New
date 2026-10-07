'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SavedCV, UserQuotaInfo } from '@/types/auth';
import { CVData } from '@/types/cv';
import { initialCVData } from '@/data/initialCV';

interface PendingVerification {
  name: string;
  email: string;
  pass: string;
  code: string;
  createdAt: number;
}

export interface PendingPasswordReset {
  email: string;
  code: string;
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isSubscriptionActive: boolean;
  isLoading: boolean;
  userCVs: SavedCV[];
  pendingVerification: PendingVerification | null;
  pendingReset: PendingPasswordReset | null;
  userQuota: UserQuotaInfo | null;
  refreshUserQuota: () => Promise<UserQuotaInfo | null>;
  consumeDownloadQuota: () => Promise<{ allowed: boolean; quotaExceeded?: boolean; error?: string; remaining?: number }>;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string; code?: string }>;
  verifyEmail: (code: string) => Promise<{ success: boolean; error?: string }>;
  resendVerificationCode: () => Promise<{ success: boolean; code?: string }>;
  cancelVerification: () => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string; code?: string }>;
  confirmPasswordReset: (code: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  cancelPasswordReset: () => void;
  activateSubscription: (plan?: 'personal' | 'enterprise') => Promise<void>;
  loginDemoUser: () => Promise<void>;
  logout: () => void;
  saveCV: (title: string, data: CVData, existingId?: string) => SavedCV;
  deleteCV: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const USERS_STORAGE_KEY = 'richi_users_db_v1';
export const SESSION_STORAGE_KEY = 'richi_current_user_v1';
export const AUTH_TOKEN_KEY = 'cvbagus_user_token_v1';
const PENDING_STORAGE_KEY = 'richi_pending_verification_v1';
const PENDING_RESET_STORAGE_KEY = 'richi_pending_reset_v1';

export const getUserAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userCVs, setUserCVs] = useState<SavedCV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingVerification, setPendingVerification] = useState<PendingVerification | null>(null);
  const [pendingReset, setPendingReset] = useState<PendingPasswordReset | null>(null);
  const [userQuota, setUserQuota] = useState<UserQuotaInfo | null>(null);

  const refreshUserQuota = async (): Promise<UserQuotaInfo | null> => {
    try {
      const res = await fetch('/api/user/quota', {
        headers: getUserAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.quota) {
          setUserQuota(data.quota);
          return data.quota;
        }
      }
    } catch (e) {
      console.warn('Failed to refresh user quota:', e);
    }
    return null;
  };

  const consumeDownloadQuota = async (): Promise<{ allowed: boolean; quotaExceeded?: boolean; error?: string; remaining?: number }> => {
    try {
      const res = await fetch('/api/user/quota', {
        method: 'POST',
        headers: getUserAuthHeaders(),
        body: JSON.stringify({ action: 'consume-download' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await refreshUserQuota();
        return { allowed: true, remaining: data.remainingDownloads };
      }
      if (data.quotaExceeded) {
        await refreshUserQuota();
        return { allowed: false, quotaExceeded: true, error: data.error };
      }
      return { allowed: false, error: data.error || 'Gagal memproses kuota unduh.' };
    } catch (e) {
      console.warn('Network issue during consumeDownloadQuota, allowing fallback:', e);
      return { allowed: true };
    }
  };

  // Helper: Check if 1-year subscription is currently active
  const checkIsSubscriptionActive = (currentUser: User | null): boolean => {
    if (!currentUser || !currentUser.isPaid || !currentUser.subscriptionExpiresAt) {
      return false;
    }
    return new Date(currentUser.subscriptionExpiresAt).getTime() > Date.now();
  };

  const isSubscriptionActive = checkIsSubscriptionActive(user);

  // 1. Load active session & pending verification on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (savedSession) {
        const parsedUser: User = JSON.parse(savedSession);
        setUser(parsedUser);
        loadUserCVs(parsedUser.id);
        refreshUserQuota();
      }

      const savedPending = localStorage.getItem(PENDING_STORAGE_KEY);
      if (savedPending) {
        setPendingVerification(JSON.parse(savedPending));
      }

      const savedReset = localStorage.getItem(PENDING_RESET_STORAGE_KEY);
      if (savedReset) {
        setPendingReset(JSON.parse(savedReset));
      }

      // Automatically purge any legacy plaintext credentials from browser localStorage
      try {
        localStorage.removeItem(USERS_STORAGE_KEY);
        const rawPending = localStorage.getItem(PENDING_STORAGE_KEY);
        if (rawPending) {
          const parsed = JSON.parse(rawPending);
          if (parsed && parsed.pass) {
            delete parsed.pass;
            localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(parsed));
          }
        }
      } catch {}
    } catch (e) {
      console.error('Failed to restore auth session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUserCVs = async (userId: string) => {
    const key = `richi_saved_cvs_${userId}`;
    let loadedCVs: SavedCV[] = [];

    // 1. Try local cache first for instant UI response
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        loadedCVs = JSON.parse(saved);
        setUserCVs(loadedCVs);
      }
    } catch {}

    // 2. Fetch latest from Cloud database (Upstash Redis)
    try {
      const res = await fetch(`/api/cv?userId=${userId}`, {
        headers: getUserAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.cvs) && data.cvs.length > 0) {
          setUserCVs(data.cvs);
          localStorage.setItem(key, JSON.stringify(data.cvs));
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load CVs from cloud, using cache:', e);
    }

    // 3. If nothing found in cloud or local, initialize default CV and sync to cloud
    if (loadedCVs.length === 0) {
      const defaultCV: SavedCV = {
        id: `cv-${Date.now()}`,
        title: 'CV Utama Saya',
        updatedAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        data: initialCVData,
      };
      setUserCVs([defaultCV]);
      localStorage.setItem(key, JSON.stringify([defaultCV]));

      fetch('/api/cv', {
        method: 'POST',
        headers: getUserAuthHeaders(),
        body: JSON.stringify({ userId, cvs: [defaultCV] }),
      }).catch(() => {});
    }
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // 2. Register: creates pending verification with OTP via server API
  const register = async (name: string, email: string, pass: string) => {
    if (!name.trim() || !email.trim() || !pass.trim()) {
      return { success: false, error: 'Harap isi semua kolom pendaftaran.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: cleanEmail,
          pass,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Gagal mendaftarkan akun.' };
      }

      const pending: PendingVerification = {
        name: name.trim(),
        email: cleanEmail,
        pass: '',
        code: '',
        createdAt: Date.now(),
      };

      setPendingVerification(pending);
      localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(pending));

      return { success: true };
    } catch (e) {
      return { success: false, error: 'Terjadi kesalahan koneksi saat mendaftar.' };
    }
  };

  // 3. Verify Email Code via server API
  const verifyEmail = async (code: string) => {
    if (!pendingVerification) {
      return { success: false, error: 'Tidak ada sesi pendaftaran yang menunggu verifikasi.' };
    }

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: pendingVerification.email,
          code: code.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.user) {
        return { success: false, error: data.error || 'Kode verifikasi salah atau kedaluwarsa.' };
      }

      const newUser: User = data.user;

      setPendingVerification(null);
      localStorage.removeItem(PENDING_STORAGE_KEY);

      setUser(newUser);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
      if (data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      }
      loadUserCVs(newUser.id);
      refreshUserQuota();

      return { success: true };
    } catch (e) {
      return { success: false, error: 'Gagal mengaktifkan akun.' };
    }
  };

  // 4. Resend Verification Code
  const resendVerificationCode = async () => {
    if (!pendingVerification) {
      return { success: false };
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: pendingVerification.name,
          email: pendingVerification.email,
          pass: pendingVerification.pass,
        }),
      });
      return { success: res.ok };
    } catch (e) {
      return { success: false };
    }
  };

  const cancelVerification = () => {
    setPendingVerification(null);
    localStorage.removeItem(PENDING_STORAGE_KEY);
  };

  // 5. Activate 1-Year Subscription (Personal Rp 25.000 / Enterprise Rp 199.000)
  const activateSubscription = async (targetPlan: 'personal' | 'enterprise' = 'personal') => {
    if (!user) return;

    // Calculate expiry 1 year from now
    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    const expiresAt = oneYearLater.toISOString();

    const updatedUser: User = {
      ...user,
      isPaid: true,
      plan: targetPlan,
      subscriptionExpiresAt: expiresAt,
    };

    setUser(updatedUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));

    // Update in cloud server database
    try {
      await fetch('/api/auth/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle-subscription',
          userId: user.id,
          isPaid: true,
          plan: targetPlan,
        }),
      });
    } catch (e) {
      console.error('Failed to sync payment with server', e);
    }

    refreshUserQuota();

    // Clean up local cache
    try {
      localStorage.removeItem(USERS_STORAGE_KEY);
    } catch {}
  };

  // 6. Login (Checks Central Server Database first, works across ALL devices)
  const login = async (email: string, pass: string) => {
    if (!email.trim() || !pass.trim()) {
      return { success: false, error: 'Harap masukkan email dan kata sandi.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check Server Database First (Cross-Device Cloud Auth)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, pass }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        const loggedInUser: User = data.user;
        setUser(loggedInUser);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(loggedInUser));
        if (data.token) {
          localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        }

        // Clean up legacy local user cache so no passwords remain in F12 LocalStorage
        try {
          localStorage.removeItem(USERS_STORAGE_KEY);
        } catch {}

        loadUserCVs(loggedInUser.id);
        refreshUserQuota();
        return { success: true };
      }

      // If server returned specific rejection (e.g. wrong password or not found)
      return { success: false, error: data.error || 'Email atau kata sandi tidak cocok.' };
    } catch (networkErr) {
      console.warn('Network issue during cloud login:', networkErr);
      return { success: false, error: 'Tidak dapat terhubung ke server autentikasi. Silakan periksa koneksi internet Anda.' };
    }
  };

  // 6b. Instant Demo Login (For immediate testing & evaluation)
  const loginDemoUser = async () => {
    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    const demoUser: User = {
      id: 'demo-user-baim',
      name: 'Baim Maulana (Demo)',
      email: 'baim@cvbagus.id',
      isVerified: true,
      isPaid: true,
      subscriptionExpiresAt: oneYearLater.toISOString(),
      createdAt: new Date().toISOString(),
      plan: 'personal',
      downloadCountThisMonth: 0,
      translateCountThisMonth: 0,
    };

    setUser(demoUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demoUser));
    loadUserCVs(demoUser.id);
    refreshUserQuota();
  };

  // 7. Logout
  const logout = () => {
    setUser(null);
    setUserCVs([]);
    setUserQuota(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  // 8. Request Password Reset (Directly sent to registered email via server)
  const requestPasswordReset = async (email: string) => {
    if (!email.trim()) {
      return { success: false, error: 'Harap masukkan alamat email Anda.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Gagal memproses reset kata sandi.' };
      }

      const pending: PendingPasswordReset = {
        email: cleanEmail,
        code: '',
        createdAt: Date.now(),
      };

      setPendingReset(pending);
      localStorage.setItem(PENDING_RESET_STORAGE_KEY, JSON.stringify(pending));

      return { success: true };
    } catch (e) {
      return { success: false, error: 'Terjadi kesalahan sistem saat meminta reset kata sandi.' };
    }
  };

  // 9. Confirm Password Reset via server
  const confirmPasswordReset = async (code: string, newPass: string) => {
    if (!pendingReset) {
      return { success: false, error: 'Tidak ada permintaan reset kata sandi yang aktif.' };
    }

    if (!code.trim()) {
      return { success: false, error: 'Kode verifikasi wajib diisi.' };
    }

    if (!newPass.trim() || newPass.trim().length < 4) {
      return { success: false, error: 'Kata sandi baru minimal harus 4 karakter.' };
    }

    try {
      const res = await fetch('/api/auth/confirm-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: pendingReset.email,
          code: code.trim(),
          newPass: newPass.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Kode verifikasi tidak sesuai atau telah kedaluwarsa.' };
      }

      // Clean up local cache
      try {
        localStorage.removeItem(USERS_STORAGE_KEY);
      } catch {}

      setPendingReset(null);
      localStorage.removeItem(PENDING_RESET_STORAGE_KEY);

      return { success: true };
    } catch (e) {
      return { success: false, error: 'Gagal memperbarui kata sandi.' };
    }
  };

  const cancelPasswordReset = () => {
    setPendingReset(null);
    localStorage.removeItem(PENDING_RESET_STORAGE_KEY);
  };

  // 10. Save CV
  const saveCV = (title: string, data: CVData, existingId?: string): SavedCV => {
    if (!user) throw new Error('Harus login untuk menyimpan CV ke akun');

    const formattedDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    let updatedList: SavedCV[];
    let targetCV: SavedCV;

    if (existingId) {
      updatedList = userCVs.map((item) => {
        if (item.id === existingId) {
          targetCV = { ...item, title, data, updatedAt: formattedDate };
          return targetCV;
        }
        return item;
      });
    } else {
      targetCV = {
        id: `cv-${Date.now()}`,
        title: title || 'Draft CV Baru',
        updatedAt: formattedDate,
        data,
      };
      updatedList = [targetCV, ...userCVs];
    }

    setUserCVs(updatedList);
    localStorage.setItem(`richi_saved_cvs_${user.id}`, JSON.stringify(updatedList));

    // Auto-sync CV document to Cloud database (Upstash Redis)
    fetch('/api/cv', {
      method: 'POST',
      headers: getUserAuthHeaders(),
      body: JSON.stringify({ userId: user.id, cvs: updatedList }),
    }).catch((err) => console.warn('Cloud CV sync notice:', err));

    return targetCV!;
  };

  // 11. Delete CV
  const deleteCV = (id: string) => {
    if (!user) return;
    const updated = userCVs.filter((item) => item.id !== id);
    setUserCVs(updated);
    localStorage.setItem(`richi_saved_cvs_${user.id}`, JSON.stringify(updated));

    // Sync deletion to Cloud database
    fetch('/api/cv', {
      method: 'POST',
      headers: getUserAuthHeaders(),
      body: JSON.stringify({ userId: user.id, cvs: updated }),
    }).catch((err) => console.warn('Cloud CV delete notice:', err));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isSubscriptionActive,
        isLoading,
        userCVs,
        pendingVerification,
        pendingReset,
        userQuota,
        refreshUserQuota,
        consumeDownloadQuota,
        login,
        register,
        verifyEmail,
        resendVerificationCode,
        cancelVerification,
        requestPasswordReset,
        confirmPasswordReset,
        cancelPasswordReset,
        activateSubscription,
        loginDemoUser,
        logout,
        saveCV,
        deleteCV,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
