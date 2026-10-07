import { NextResponse } from 'next/server';
import { getAllUsers, saveAllUsers, getEffectiveUserQuotas } from '@/lib/serverDb';
import {
  verifyPassword,
  hashPassword,
  isPasswordHashed,
  checkRateLimit,
  getClientIp,
  createUserToken,
} from '@/lib/security';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const body = await request.json();
    const { email, pass } = body;

    if (!email?.trim() || !pass?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email dan kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // 1. Rate Limiting: 5 attempts per 5 minutes per IP and per email
    const ipLimit = await checkRateLimit(`login-ip:${ip}`, 5, 5 * 60);
    const emailLimit = await checkRateLimit(`login-email:${cleanEmail}`, 5, 5 * 60);

    if (!ipLimit.success || !emailLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terlalu banyak percobaan masuk yang gagal. Silakan tunggu 5 menit sebelum mencoba kembali, atau gunakan fitur Lupa Kata Sandi.',
        },
        { status: 429 }
      );
    }

    const allUsers = await getAllUsers();
    console.log(`[LOGIN] Attempt for email "${cleanEmail}". Registered users in DB: ${allUsers.length}`);

    // Look for matching user by email
    const foundIdx = allUsers.findIndex(
      (u) => u.email.trim().toLowerCase() === cleanEmail
    );

    if (foundIdx === -1) {
      return NextResponse.json(
        { success: false, error: 'Akun dengan email ini belum terdaftar. Silakan buat akun baru terlebih dahulu.' },
        { status: 404 }
      );
    }

    const found = allUsers[foundIdx];

    // 2. Cryptographic Password Verification
    const isMatch = verifyPassword(cleanPass, found.pass);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Kata sandi salah. Silakan periksa kembali atau gunakan fitur Lupa Kata Sandi.' },
        { status: 401 }
      );
    }

    // 3. Transparent Security Upgrade: Migrate legacy plaintext to Scrypt hash
    if (!isPasswordHashed(found.pass)) {
      try {
        const upgradedUsers = [...allUsers];
        upgradedUsers[foundIdx] = {
          ...found,
          pass: hashPassword(cleanPass),
        };
        await saveAllUsers(upgradedUsers);
        console.log(`[SECURITY] Successfully auto-upgraded password hash for "${cleanEmail}" to Scrypt.`);
      } catch (err) {
        console.warn('Failed to upgrade password hash:', err);
      }
    }

    const { user: effectiveUser, hasChanged } = getEffectiveUserQuotas(found);
    if (hasChanged) {
      allUsers[foundIdx] = effectiveUser;
      await saveAllUsers(allUsers);
    }

    // Return safe user object (never expose password or hash to client)
    const safeUser = {
      id: effectiveUser.id,
      name: effectiveUser.name,
      email: effectiveUser.email,
      isVerified: effectiveUser.isVerified ?? true,
      isPaid: effectiveUser.isPaid ?? false,
      role: effectiveUser.role || (effectiveUser.email.toLowerCase().includes('admin') ? 'admin' : 'user'),
      subscriptionExpiresAt: effectiveUser.subscriptionExpiresAt,
      createdAt: effectiveUser.createdAt,
      plan: effectiveUser.plan || 'personal',
      downloadCountThisMonth: effectiveUser.downloadCountThisMonth ?? 0,
      translateCountThisMonth: effectiveUser.translateCountThisMonth ?? 0,
      lastQuotaResetMonth: effectiveUser.lastQuotaResetMonth,
    };

    // 4. Generate Cryptographically Signed User Session Token
    const token = createUserToken(safeUser.id, safeUser.email);

    return NextResponse.json({
      success: true,
      message: 'Login berhasil!',
      user: safeUser,
      token,
    });
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat memproses login.' },
      { status: 500 }
    );
  }
}
