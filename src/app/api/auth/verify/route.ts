import { NextResponse } from 'next/server';
import {
  getPendingVerification,
  removePendingVerification,
  getAllUsers,
  saveAllUsers,
  UserRecord,
  getCurrentMonthKey,
} from '@/lib/serverDb';
import {
  checkRateLimit,
  getClientIp,
  createUserToken,
  isPasswordHashed,
  hashPassword,
} from '@/lib/security';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const body = await request.json();
    const { email, code } = body;

    if (!email?.trim() || !code?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email dan kode verifikasi wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Rate Limiting: Max 5 OTP verification attempts per 10 minutes to prevent brute forcing 6-digit codes
    const rateLimit = await checkRateLimit(`verify-otp:${cleanEmail}:${ip}`, 5, 10 * 60);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terlalu banyak percobaan kode verifikasi yang salah. Silakan minta kode baru.',
        },
        { status: 429 }
      );
    }

    const pending = await getPendingVerification(cleanEmail);

    if (!pending) {
      return NextResponse.json(
        { success: false, error: 'Sesi verifikasi telah kedaluwarsa atau tidak ditemukan. Silakan daftar ulang.' },
        { status: 400 }
      );
    }

    if (pending.code !== code.trim()) {
      return NextResponse.json(
        { success: false, error: 'Kode verifikasi 6 digit yang Anda masukkan salah. Cek email Anda lagi.' },
        { status: 400 }
      );
    }

    // Check expiry (15 minutes)
    if (Date.now() - pending.createdAt > 15 * 60 * 1000) {
      await removePendingVerification(cleanEmail);
      return NextResponse.json(
        { success: false, error: 'Kode verifikasi telah kedaluwarsa (lebih dari 15 menit). Silakan minta kode baru.' },
        { status: 400 }
      );
    }

    // Code is valid! Create official user record
    const allUsers = await getAllUsers();
    
    // Check again if already exists
    const existingIdx = allUsers.findIndex((u) => u.email.toLowerCase() === cleanEmail);
    const userId = existingIdx >= 0 ? allUsers[existingIdx].id : `usr-${Date.now()}`;

    // Ensure password is cryptographically hashed
    const storedPass = isPasswordHashed(pending.pass) ? pending.pass : hashPassword(pending.pass);

    const newUser: UserRecord = {
      id: userId,
      name: pending.name,
      email: pending.email,
      pass: storedPass,
      isVerified: true,
      isPaid: false,
      createdAt: new Date().toISOString(),
      plan: 'personal',
      downloadCountThisMonth: 0,
      translateCountThisMonth: 0,
      lastQuotaResetMonth: getCurrentMonthKey(),
    };

    let updatedUsers: UserRecord[];
    if (existingIdx >= 0) {
      updatedUsers = allUsers.map((u, i) => (i === existingIdx ? newUser : u));
    } else {
      updatedUsers = [...allUsers, newUser];
    }

    await saveAllUsers(updatedUsers);
    await removePendingVerification(cleanEmail);

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isVerified: newUser.isVerified,
      isPaid: newUser.isPaid,
      createdAt: newUser.createdAt,
      plan: newUser.plan,
      downloadCountThisMonth: newUser.downloadCountThisMonth,
      translateCountThisMonth: newUser.translateCountThisMonth,
      lastQuotaResetMonth: newUser.lastQuotaResetMonth,
    };

    // Issue cryptographic session token
    const token = createUserToken(safeUser.id, safeUser.email);

    return NextResponse.json({
      success: true,
      message: 'Akun Anda berhasil diverifikasi dan aktif!',
      user: safeUser,
      token,
    });
  } catch (error: any) {
    console.error('Verification API error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat memverifikasi akun.' },
      { status: 500 }
    );
  }
}
