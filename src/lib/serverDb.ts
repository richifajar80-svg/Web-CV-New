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

// Environment variables for Vercel KV / Upstash Redis (Dynamic lookup)
const getKvConfig = () => {
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN;
  return { url, token };
};

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

/**
 * Read all registered users from Cloud Storage (Vercel KV / Upstash) or Fallback
 */
export async function getAllUsers(): Promise<UserRecord[]> {
  const { url: KV_URL, token: KV_TOKEN } = getKvConfig();

  // 1. Try Cloud KV if configured
  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/get/cvbagus_users_v1`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
          if (Array.isArray(parsed)) {
            global.__cvbagus_users_cache = parsed;
            return parsed;
          }
        }
      }
    } catch (err) {
      console.error('Error fetching users from KV:', err);
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
 * Save all registered users to Cloud Storage (Vercel KV / Upstash) and Fallback
 */
export async function saveAllUsers(users: UserRecord[]): Promise<boolean> {
  const { url: KV_URL, token: KV_TOKEN } = getKvConfig();
  global.__cvbagus_users_cache = users;

  // 1. Save to Cloud KV if configured
  if (KV_URL && KV_TOKEN) {
    try {
      await fetch(`${KV_URL}/set/cvbagus_users_v1`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(users),
      });
    } catch (err) {
      console.error('Error saving users to KV:', err);
    }
  }

  // 2. Save to local fallback file
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
  const { url: KV_URL, token: KV_TOKEN } = getKvConfig();
  if (!global.__cvbagus_pending_cache) global.__cvbagus_pending_cache = {};
  global.__cvbagus_pending_cache[pending.email.toLowerCase()] = pending;

  if (KV_URL && KV_TOKEN) {
    try {
      await fetch(`${KV_URL}/set/pending_${pending.email.toLowerCase()}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pending),
      });
    } catch (e) {
      console.error('Error saving pending verification to KV:', e);
    }
  }
}

export async function getPendingVerification(email: string): Promise<PendingRecord | null> {
  const { url: KV_URL, token: KV_TOKEN } = getKvConfig();
  const cleanEmail = email.trim().toLowerCase();

  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/get/pending_${cleanEmail}`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
        }
      }
    } catch (e) {
      console.error('Error getting pending from KV:', e);
    }
  }

  return global.__cvbagus_pending_cache?.[cleanEmail] || null;
}

export async function removePendingVerification(email: string): Promise<void> {
  const { url: KV_URL, token: KV_TOKEN } = getKvConfig();
  const cleanEmail = email.trim().toLowerCase();
  if (global.__cvbagus_pending_cache) {
    delete global.__cvbagus_pending_cache[cleanEmail];
  }

  if (KV_URL && KV_TOKEN) {
    try {
      await fetch(`${KV_URL}/del/pending_${cleanEmail}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
      });
    } catch (e) {
      console.error('Error removing pending from KV:', e);
    }
  }
}

/**
 * Pending Password Reset Store
 */
export async function setPendingReset(reset: ResetRecord): Promise<void> {
  const { url: KV_URL, token: KV_TOKEN } = getKvConfig();
  if (!global.__cvbagus_reset_cache) global.__cvbagus_reset_cache = {};
  global.__cvbagus_reset_cache[reset.email.toLowerCase()] = reset;

  if (KV_URL && KV_TOKEN) {
    try {
      await fetch(`${KV_URL}/set/reset_${reset.email.toLowerCase()}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reset),
      });
    } catch (e) {
      console.error('Error saving pending reset to KV:', e);
    }
  }
}

export async function getPendingReset(email: string): Promise<ResetRecord | null> {
  const { url: KV_URL, token: KV_TOKEN } = getKvConfig();
  const cleanEmail = email.trim().toLowerCase();

  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/get/reset_${cleanEmail}`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
        }
      }
    } catch (e) {
      console.error('Error getting pending reset from KV:', e);
    }
  }

  return global.__cvbagus_reset_cache?.[cleanEmail] || null;
}

export async function removePendingReset(email: string): Promise<void> {
  const { url: KV_URL, token: KV_TOKEN } = getKvConfig();
  const cleanEmail = email.trim().toLowerCase();
  if (global.__cvbagus_reset_cache) {
    delete global.__cvbagus_reset_cache[cleanEmail];
  }

  if (KV_URL && KV_TOKEN) {
    try {
      await fetch(`${KV_URL}/del/reset_${cleanEmail}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
      });
    } catch (e) {
      console.error('Error removing reset from KV:', e);
    }
  }
}
