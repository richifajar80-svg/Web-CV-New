import crypto from 'crypto';
import { getRedisClient } from './serverDb';

// Secret key for HMAC token signing
const SERVER_SECRET =
  process.env.SERVER_AUTH_SECRET ||
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  'cvbagus-secure-production-secret-key-2026';

const ADMIN_PIN = process.env.ADMIN_PIN || 'cvbagus2026';

/**
 * 1. Password Hashing via Scrypt + Cryptographic Salt
 * Immune to rainbow tables and brute force attacks.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `$scrypt$${salt}$${derivedKey.toString('hex')}`;
}

/**
 * Verify password against stored hash with backward compatibility
 * Uses constant-time comparison to prevent timing attacks.
 */
export function verifyPassword(password: string, storedHash?: string): boolean {
  if (!storedHash || !password) return false;

  // New format: $scrypt$salt$hash
  if (storedHash.startsWith('$scrypt$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 4) return false;
    const salt = parts[2];
    const originalHash = parts[3];

    const derivedKey = crypto.scryptSync(password, salt, 64);
    const originalBuffer = Buffer.from(originalHash, 'hex');
    const derivedBuffer = derivedKey;

    if (originalBuffer.length !== derivedBuffer.length) return false;
    return crypto.timingSafeEqual(originalBuffer, derivedBuffer);
  }

  // Backward compatibility fallback for legacy plaintext passwords
  return password.trim() === storedHash.trim();
}

export function isPasswordHashed(stored?: string): boolean {
  return typeof stored === 'string' && stored.startsWith('$scrypt$');
}

/**
 * 2. Rate Limiting via Upstash Redis with Memory Fallback
 * Prevents brute-force login, OTP spamming, and DDoS.
 */
interface RateLimitMemoryEntry {
  count: number;
  resetAt: number;
}
const memoryRateLimits = new Map<string, RateLimitMemoryEntry>();

export async function checkRateLimit(
  key: string,
  limit: number = 5,
  windowSeconds: number = 60
): Promise<{ success: boolean; remaining: number }> {
  const redis = getRedisClient();

  if (redis) {
    try {
      const redisKey = `ratelimit:${key}`;
      const count = await redis.incr(redisKey);
      if (count === 1) {
        await redis.expire(redisKey, windowSeconds);
      }
      const remaining = Math.max(0, limit - count);
      return { success: count <= limit, remaining };
    } catch (err) {
      console.warn('Redis rate limit error, using in-memory limiter:', err);
    }
  }

  // In-memory rate limiting fallback
  const now = Date.now();
  const entry = memoryRateLimits.get(key);

  if (!entry || now > entry.resetAt) {
    memoryRateLimits.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { success: true, remaining: limit - 1 };
  }

  entry.count += 1;
  const remaining = Math.max(0, limit - entry.count);
  return { success: entry.count <= limit, remaining };
}

/**
 * 3. Client IP helper for security logging and rate limiting
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  return '127.0.0.1';
}

/**
 * 4. Admin Authentication & Session Signature
 * Secures all administrative operations.
 */
export function verifyAdminPin(pin: string): boolean {
  const cleanPin = pin.trim();
  return cleanPin === ADMIN_PIN;
}

export function createAdminToken(): string {
  const timestamp = Date.now();
  const payload = `admin_${timestamp}`;
  const hmac = crypto.createHmac('sha256', SERVER_SECRET).update(payload).digest('hex');
  return `${payload}.${hmac}`;
}

export function verifyAdminRequest(request: Request): boolean {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('x-admin-token');
    if (!authHeader) return false;

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return false;

    const expectedHmac = crypto.createHmac('sha256', SERVER_SECRET).update(payload).digest('hex');
    const sigBuf = Buffer.from(signature, 'hex');
    const expBuf = Buffer.from(expectedHmac, 'hex');

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return false;
    }

    // Token expires after 12 hours
    const parts = payload.split('_');
    const timestamp = parseInt(parts[1], 10);
    if (isNaN(timestamp) || Date.now() - timestamp > 12 * 60 * 60 * 1000) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * 5. User Auth Token (Stateless Session Signature)
 * Prevents user impersonation and IDOR attacks.
 */
export function createUserToken(userId: string, email: string): string {
  const timestamp = Date.now();
  const payload = `${userId}:${email.toLowerCase()}:${timestamp}`;
  const hmac = crypto.createHmac('sha256', SERVER_SECRET).update(payload).digest('hex');
  return `${payload}:${hmac}`;
}

export function verifyUserToken(token: string | null): { userId: string; email: string } | null {
  try {
    if (!token) return null;
    const parts = token.split(':');
    if (parts.length !== 4) return null;

    const [userId, email, timestampStr, signature] = parts;
    const payload = `${userId}:${email}:${timestampStr}`;
    const expectedHmac = crypto.createHmac('sha256', SERVER_SECRET).update(payload).digest('hex');

    const sigBuf = Buffer.from(signature, 'hex');
    const expBuf = Buffer.from(expectedHmac, 'hex');

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    // Valid for 30 days
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp) || Date.now() - timestamp > 30 * 24 * 60 * 60 * 1000) {
      return null;
    }

    return { userId, email };
  } catch {
    return null;
  }
}
