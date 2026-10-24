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
  verifyOTPCode,
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

    // 1. Rate Limiting: Max 5 OTP verification attempts per 10 minutes per email AND per IP
    const ipLimit = await checkRateLimit(`verify-otp-ip:${ip}`, 10, 10 * 60);
    const emailLimit = await checkRateLimit(`verify-otp-email:${cleanEmail}`, 5, 10 * 60);
    if (!ipLimit.success || !emailLimit.success) {
      if (!emailLimit.success) {
        // Invalidate OTP on target email after 5 failed attempts to prevent IP-rotation brute force
        await removePendingVerification(cleanEmail);
      }
      return NextResponse.json(
        {
          success: false,
          error: 'Terlalu banyak percobaan kode verifikasi yang salah. Demi keamanan, silakan klik Kirim Ulang Kode Baru.',
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

    if (!verifyOTPCode(code, pending.code)) {
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
    
    // Prevent overwriting an already-registered account
    const existingIdx = allUsers.findIndex((u) => u.email.toLowerCase() === cleanEmail);
    if (existingIdx >= 0) {
      await removePendingVerification(cleanEmail);
      return NextResponse.json(
        { success: false, error: 'Email ini sudah terdaftar dan aktif. Silakan masuk menggunakan kata sandi Anda.' },
        { status: 400 }
      );
    }

    const userId = `usr-${Date.now()}`;

    // Ensure password is cryptographically hashed
    const storedPass = isPasswordHashed(pending.pass) ? pending.pass : hashPassword(pending.pass);

    const newUser: UserRecord = {
      id: userId,
      name: pending.name,
      email: pending.email,
      pass: storedPass,
      isVerified: true,
      isPaid: false,
      role: 'user',
      createdAt: new Date().toISOString(),
      plan: 'personal',
      downloadCountThisMonth: 0,
      translateCountThisMonth: 0,
      lastQuotaResetMonth: getCurrentMonthKey(),
    };

    const updatedUsers: UserRecord[] = [...allUsers, newUser];

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
