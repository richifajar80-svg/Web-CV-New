'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SavedCV } from '@/types/auth';
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
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string; code?: string }>;
  verifyEmail: (code: string) => Promise<{ success: boolean; error?: string }>;
  resendVerificationCode: () => Promise<{ success: boolean; code?: string }>;
  cancelVerification: () => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string; code?: string }>;
  confirmPasswordReset: (code: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  cancelPasswordReset: () => void;
  activateSubscription: () => Promise<void>;
  loginDemoUser: () => Promise<void>;
  logout: () => void;
  saveCV: (title: string, data: CVData, existingId?: string) => SavedCV;
  deleteCV: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const USERS_STORAGE_KEY = 'richi_users_db_v1';
export const SESSION_STORAGE_KEY = 'richi_current_user_v1';
const PENDING_STORAGE_KEY = 'richi_pending_verification_v1';
const PENDING_RESET_STORAGE_KEY = 'richi_pending_reset_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userCVs, setUserCVs] = useState<SavedCV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingVerification, setPendingVerification] = useState<PendingVerification | null>(null);
  const [pendingReset, setPendingReset] = useState<PendingPasswordReset | null>(null);

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
      }

      const savedPending = localStorage.getItem(PENDING_STORAGE_KEY);
      if (savedPending) {
        setPendingVerification(JSON.parse(savedPending));
      }

      const savedReset = localStorage.getItem(PENDING_RESET_STORAGE_KEY);
      if (savedReset) {
        setPendingReset(JSON.parse(savedReset));
      }
    } catch (e) {
      console.error('Failed to restore auth session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUserCVs = (userId: string) => {
    try {
      const key = `richi_saved_cvs_${userId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setUserCVs(JSON.parse(saved));
      } else {
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
      }
    } catch (e) {
      console.error('Failed to load user CVs', e);
    }
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // 2. Register: creates pending verification with OTP
  const register = async (name: string, email: string, pass: string) => {
    if (!name.trim() || !email.trim() || !pass.trim()) {
      return { success: false, error: 'Harap isi semua kolom pendaftaran.' };
    }

    try {
      const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const users: Array<User & { pass: string }> = rawUsers ? JSON.parse(rawUsers) : [];

      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return { success: false, error: 'Email ini sudah terdaftar. Silakan masuk.' };
      }

      const otp = generateOTP();
      const pending: PendingVerification = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        pass,
        code: otp,
        createdAt: Date.now(),
      };

      setPendingVerification(pending);
      localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(pending));

      // Trigger email sending via admin.cvbagusid@gmail.com
      try {
        await fetch('/api/auth/send-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: pending.email,
            name: pending.name,
            code: otp,
            type: 'register',
          }),
        });
      } catch (sendErr) {
        console.error('Email API send notice:', sendErr);
      }

      return { success: true, code: otp };
    } catch (e) {
      return { success: false, error: 'Terjadi kesalahan sistem saat mendaftar.' };
    }
  };

  // 3. Verify Email Code
  const verifyEmail = async (code: string) => {
    if (!pendingVerification) {
      return { success: false, error: 'Tidak ada sesi pendaftaran yang menunggu verifikasi.' };
    }

    if (code.trim() !== pendingVerification.code) {
      return { success: false, error: 'Kode verifikasi salah. Harap periksa kembali.' };
    }

    try {
      const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const users: Array<User & { pass: string }> = rawUsers ? JSON.parse(rawUsers) : [];

      const newUser: User = {
        id: `user-${Date.now()}`,
        name: pendingVerification.name,
        email: pendingVerification.email,
        isVerified: true,
        isPaid: false, // Will be activated upon Rp 25rb payment
        createdAt: new Date().toISOString(),
      };

      users.push({ ...newUser, pass: pendingVerification.pass });
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      // Clear pending verification
      setPendingVerification(null);
      localStorage.removeItem(PENDING_STORAGE_KEY);

      // Log in user
      setUser(newUser);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
      loadUserCVs(newUser.id);

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

    const newOtp = generateOTP();
    const updated: PendingVerification = {
      ...pendingVerification,
      code: newOtp,
      createdAt: Date.now(),
    };

    setPendingVerification(updated);
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(updated));

    // Trigger email sending via admin.cvbagusid@gmail.com
    try {
      await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: updated.email,
          name: updated.name,
          code: newOtp,
          type: 'register',
        }),
      });
    } catch (sendErr) {
      console.error('Email API resend notice:', sendErr);
    }

    return { success: true, code: newOtp };
  };

  const cancelVerification = () => {
    setPendingVerification(null);
    localStorage.removeItem(PENDING_STORAGE_KEY);
  };

  // 5. Activate 1-Year Subscription (Rp 25.000)
  const activateSubscription = async () => {
    if (!user) return;

    // Calculate expiry 1 year from now
    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    const expiresAt = oneYearLater.toISOString();

    const updatedUser: User = {
      ...user,
      isPaid: true,
      subscriptionExpiresAt: expiresAt,
    };

    setUser(updatedUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));

    // Update in users database
    try {
      const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (rawUsers) {
        const users: Array<User & { pass: string }> = JSON.parse(rawUsers);
        const updatedUsers = users.map((u) =>
          u.id === user.id ? { ...u, isPaid: true, subscriptionExpiresAt: expiresAt } : u
        );
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      }
    } catch (e) {
      console.error('Failed to update users db with payment', e);
    }
  };

  // 6. Login
  const login = async (email: string, pass: string) => {
    if (!email.trim() || !pass.trim()) {
      return { success: false, error: 'Harap masukkan email dan kata sandi.' };
    }

    try {
      const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const users: Array<User & { pass: string }> = rawUsers ? JSON.parse(rawUsers) : [];

      const found = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.pass === pass
      );

      if (!found) {
        return { success: false, error: 'Email atau kata sandi tidak cocok.' };
      }

      const loggedInUser: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        isVerified: found.isVerified ?? true,
        isPaid: found.isPaid ?? false,
        subscriptionExpiresAt: found.subscriptionExpiresAt,
        createdAt: found.createdAt,
      };

      setUser(loggedInUser);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(loggedInUser));
      loadUserCVs(loggedInUser.id);

      return { success: true };
    } catch (e) {
      return { success: false, error: 'Gagal melakukan login.' };
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
    };

    setUser(demoUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demoUser));
    loadUserCVs(demoUser.id);
  };

  // 7. Logout
  const logout = () => {
    setUser(null);
    setUserCVs([]);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  // 8. Request Password Reset (Directly sent to registered email)
  const requestPasswordReset = async (email: string) => {
    if (!email.trim()) {
      return { success: false, error: 'Harap masukkan alamat email Anda.' };
    }

    try {
      const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const users: Array<User & { pass: string }> = rawUsers ? JSON.parse(rawUsers) : [];

      const targetEmail = email.trim().toLowerCase();
      const userExists = users.some((u) => u.email.toLowerCase() === targetEmail);

      if (!userExists) {
        return {
          success: false,
          error: 'Alamat email ini belum terdaftar. Silakan periksa kembali atau buat akun baru.',
        };
      }

      // Generate 6-digit confirmation code
      const code = generateOTP();
      const pending: PendingPasswordReset = {
        email: targetEmail,
        code,
        createdAt: Date.now(),
      };

      setPendingReset(pending);
      localStorage.setItem(PENDING_RESET_STORAGE_KEY, JSON.stringify(pending));

      // Trigger email sending via admin.cvbagusid@gmail.com
      try {
        await fetch('/api/auth/send-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: targetEmail,
            code,
            type: 'reset',
          }),
        });
      } catch (sendErr) {
        console.error('Email API reset notice:', sendErr);
      }

      return { success: true, code };
    } catch (e) {
      return { success: false, error: 'Gagal memproses permintaan reset kata sandi.' };
    }
  };

  // 9. Confirm Password Reset
  const confirmPasswordReset = async (code: string, newPass: string) => {
    if (!pendingReset) {
      return { success: false, error: 'Tidak ada permintaan reset kata sandi yang aktif.' };
    }

    if (!code.trim() || code.trim() !== pendingReset.code) {
      return { success: false, error: 'Kode verifikasi tidak sesuai atau telah kedaluwarsa.' };
    }

    if (!newPass.trim() || newPass.trim().length < 4) {
      return { success: false, error: 'Kata sandi baru minimal harus 4 karakter.' };
    }

    try {
      const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (!rawUsers) {
        return { success: false, error: 'Basis data pengguna tidak ditemukan.' };
      }

      const users: Array<User & { pass: string }> = JSON.parse(rawUsers);
      const userIdx = users.findIndex((u) => u.email.toLowerCase() === pendingReset.email);

      if (userIdx === -1) {
        return { success: false, error: 'Pengguna tidak ditemukan.' };
      }

      users[userIdx].pass = newPass.trim();
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      // Clear pending reset
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
    return targetCV!;
  };

  // 11. Delete CV
  const deleteCV = (id: string) => {
    if (!user) return;
    const updated = userCVs.filter((item) => item.id !== id);
    setUserCVs(updated);
    localStorage.setItem(`richi_saved_cvs_${user.id}`, JSON.stringify(updated));
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
