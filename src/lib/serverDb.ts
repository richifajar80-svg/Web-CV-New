import { Redis } from '@upstash/redis';
import fs from 'fs';
import path from 'path';
import { User } from '@/types/auth';

export interface UserRecord extends User {
  pass: string;
}

export interface PendingRecord {
  name: string;
  email: string;
  pass: string;
  code: string;
  createdAt: number;
}

export interface ResetRecord {
  email: string;
  code: string;
  createdAt: number;
}

export interface PaymentOrderRecord {
  orderId: string;
  userId: string;
  email: string;
  plan: 'personal' | 'enterprise';
  amount: number;
  status: 'pending' | 'paid' | 'expired' | 'failed';
  snapToken?: string;
  redirectUrl?: string;
  createdAt: number;
  paidAt?: number;
}

// Initialize Upstash Redis instance dynamically
export function getRedisClient(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    process.env.KV_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN;

  if (url && token) {
    try {
      return new Redis({ url, token });
    } catch (e) {
      console.error('Failed to initialize Upstash Redis client:', e);
    }
  }
  return null;
}

// Local fallback file path
const getFilePath = () => {
  if (process.env.VERCEL === '1') {
    return '/tmp/cvbagus_users_db.json';
  }
  return path.join(process.cwd(), '.users_db_cache.json');
};

// Global in-memory cache to maintain state across hot lambdas
declare global {
  var __cvbagus_users_cache: UserRecord[] | undefined;
  var __cvbagus_pending_cache: Record<string, PendingRecord> | undefined;
  var __cvbagus_reset_cache: Record<string, ResetRecord> | undefined;
  var __cvbagus_orders_cache: Record<string, PaymentOrderRecord> | undefined;
}

if (!global.__cvbagus_users_cache) {
  global.__cvbagus_users_cache = [];
}
if (!global.__cvbagus_pending_cache) {
  global.__cvbagus_pending_cache = {};
}
if (!global.__cvbagus_reset_cache) {
  global.__cvbagus_reset_cache = {};
}
if (!global.__cvbagus_orders_cache) {
  global.__cvbagus_orders_cache = {};
}

/**
 * Read all registered users from Cloud Storage (Upstash Redis) or Fallback
 */
export async function getAllUsers(): Promise<UserRecord[]> {
  const redis = getRedisClient();

  // 1. Try Upstash Redis
  if (redis) {
    try {
      const data = await redis.get<UserRecord[]>('cvbagus_users_v1');
      if (Array.isArray(data)) {
        global.__cvbagus_users_cache = data;
        return data;
      }
    } catch (err) {
      console.error('Error fetching users from Upstash Redis:', err);
    }
  }

  // 2. Try in-memory global cache
  if (global.__cvbagus_users_cache && global.__cvbagus_users_cache.length > 0) {
    return global.__cvbagus_users_cache;
  }

  // 3. Try reading from filesystem cache
  try {
    const filePath = getFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        global.__cvbagus_users_cache = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading fallback file:', err);
  }

  return global.__cvbagus_users_cache || [];
}

/**
 * Save all registered users to Cloud Storage (Upstash Redis) and Fallback
 */
export async function saveAllUsers(users: UserRecord[]): Promise<boolean> {
  global.__cvbagus_users_cache = users;

  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.set('cvbagus_users_v1', users);
    } catch (err) {
      console.error('Error saving users to Upstash Redis:', err);
    }
  }

  // Also save to local fallback file
  try {
    const filePath = getFilePath();
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    // Ignore file write errors on read-only environments
  }

  return true;
}

/**
 * Pending Verifications Store
 */
export async function setPendingVerification(pending: PendingRecord): Promise<void> {
  const cleanEmail = pending.email.toLowerCase();
  if (!global.__cvbagus_pending_cache) global.__cvbagus_pending_cache = {};
  global.__cvbagus_pending_cache[cleanEmail] = pending;

  const redis = getRedisClient();
  if (redis) {
    try {
      // Auto expire in 15 minutes (900 seconds)
      await redis.set(`pending_${cleanEmail}`, pending, { ex: 900 });
    } catch (e) {
      console.error('Error saving pending verification to Redis:', e);
    }
  }
}

export async function getPendingVerification(email: string): Promise<PendingRecord | null> {
  const cleanEmail = email.trim().toLowerCase();

  const redis = getRedisClient();
  if (redis) {
    try {
      const data = await redis.get<PendingRecord>(`pending_${cleanEmail}`);
      if (data) return data;
    } catch (e) {
      console.error('Error getting pending from Redis:', e);
    }
  }

  return global.__cvbagus_pending_cache?.[cleanEmail] || null;
}

export async function removePendingVerification(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  if (global.__cvbagus_pending_cache) {
    delete global.__cvbagus_pending_cache[cleanEmail];
  }

  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.del(`pending_${cleanEmail}`);
    } catch (e) {
      console.error('Error removing pending from Redis:', e);
    }
  }
}

/**
 * Pending Password Reset Store
 */
export async function setPendingReset(reset: ResetRecord): Promise<void> {
  const cleanEmail = reset.email.toLowerCase();
  if (!global.__cvbagus_reset_cache) global.__cvbagus_reset_cache = {};
  global.__cvbagus_reset_cache[cleanEmail] = reset;

  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.set(`reset_${cleanEmail}`, reset, { ex: 900 });
    } catch (e) {
      console.error('Error saving pending reset to Redis:', e);
    }
  }
}

export async function getPendingReset(email: string): Promise<ResetRecord | null> {
  const cleanEmail = email.trim().toLowerCase();

  const redis = getRedisClient();
  if (redis) {
    try {
      const data = await redis.get<ResetRecord>(`reset_${cleanEmail}`);
      if (data) return data;
    } catch (e) {
      console.error('Error getting pending reset from Redis:', e);
    }
  }

  return global.__cvbagus_reset_cache?.[cleanEmail] || null;
}

export async function removePendingReset(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  if (global.__cvbagus_reset_cache) {
    delete global.__cvbagus_reset_cache[cleanEmail];
  }

  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.del(`reset_${cleanEmail}`);
    } catch (e) {
      console.error('Error removing reset from Redis:', e);
    }
  }
}

/**
 * Customer CV Cloud Storage (Upstash Redis)
 */
export async function getUserCVs(userId: string): Promise<any[]> {
  const redis = getRedisClient();
  if (redis) {
    try {
      const data = await redis.get<any[]>(`cvbagus_cvs_${userId}`);
      if (Array.isArray(data)) return data;
    } catch (e) {
      console.error('Error fetching CVs from Redis:', e);
    }
  }
  return [];
}

export async function saveUserCVs(userId: string, cvs: any[]): Promise<boolean> {
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.set(`cvbagus_cvs_${userId}`, cvs);
      return true;
    } catch (e) {
      console.error('Error saving CVs to Redis:', e);
    }
  }
  return false;
}

/**
 * Quota & Fair Usage Policy (FUP) Helper
 */
export function getCurrentMonthKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getEffectiveUserQuotas(user: UserRecord): { user: UserRecord; hasChanged: boolean } {
  const currentMonth = getCurrentMonthKey();
  let hasChanged = false;
  const updatedUser: UserRecord = { ...user };

  if (!updatedUser.plan) {
    updatedUser.plan = 'personal';
    hasChanged = true;
  }

  if (updatedUser.lastQuotaResetMonth !== currentMonth) {
    updatedUser.downloadCountThisMonth = 0;
    updatedUser.translateCountThisMonth = 0;
    updatedUser.lastQuotaResetMonth = currentMonth;
    hasChanged = true;
  } else {
    if (typeof updatedUser.downloadCountThisMonth !== 'number') {
      updatedUser.downloadCountThisMonth = 0;
      hasChanged = true;
    }
    if (typeof updatedUser.translateCountThisMonth !== 'number') {
      updatedUser.translateCountThisMonth = 0;
      hasChanged = true;
    }
  }

  return { user: updatedUser, hasChanged };
}

/**
 * Payment Order Store & Automatic 1-Year Subscription Activation (Midtrans)
 */
export async function savePaymentOrder(order: PaymentOrderRecord): Promise<void> {
  if (!global.__cvbagus_orders_cache) global.__cvbagus_orders_cache = {};
  global.__cvbagus_orders_cache[order.orderId] = order;

  const redis = getRedisClient();
  if (redis) {
    try {
      // Keep order record for 7 days
      await redis.set(`payment_order_${order.orderId}`, order, { ex: 7 * 24 * 3600 });
      await redis.set(`payment_latest_user_${order.userId}`, order.orderId, { ex: 7 * 24 * 3600 });
    } catch (e) {
      console.error('Error saving payment order to Redis:', e);
    }
  }
}

export async function getPaymentOrder(orderId: string): Promise<PaymentOrderRecord | null> {
  const cleanId = orderId.trim();
  const redis = getRedisClient();
  if (redis) {
    try {
      const data = await redis.get<PaymentOrderRecord>(`payment_order_${cleanId}`);
      if (data) return data;
    } catch (e) {
      console.error('Error reading payment order from Redis:', e);
    }
  }
  return global.__cvbagus_orders_cache?.[cleanId] || null;
}

export async function getLatestUserPaymentOrder(userId: string): Promise<PaymentOrderRecord | null> {
  const redis = getRedisClient();
  if (redis) {
    try {
      const latestOrderId = await redis.get<string>(`payment_latest_user_${userId}`);
      if (latestOrderId) {
        return await getPaymentOrder(latestOrderId);
      }
    } catch (e) {
      console.error('Error reading latest user order from Redis:', e);
    }
  }

  if (global.__cvbagus_orders_cache) {
    const userOrders = Object.values(global.__cvbagus_orders_cache)
      .filter((o) => o.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
    if (userOrders.length > 0) return userOrders[0];
  }
  return null;
}

export async function activateUserPaidSubscription(
  userId: string,
  plan: 'personal' | 'enterprise'
): Promise<UserRecord | null> {
  const allUsers = await getAllUsers();
  const idx = allUsers.findIndex((u) => u.id === userId);
  if (idx === -1) return null;

  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  const existing = allUsers[idx];
  const updatedUser: UserRecord = {
    ...existing,
    isPaid: true,
    plan,
    subscriptionExpiresAt: oneYearLater.toISOString(),
  };

  allUsers[idx] = updatedUser;
  await saveAllUsers(allUsers);
  return updatedUser;
}


