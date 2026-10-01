import { NextResponse } from 'next/server';
import {
  getAllUsers,
  saveAllUsers,
  getPendingReset,
  removePendingReset,
} from '@/lib/serverDb';
import {
  hashPassword,
  checkRateLimit,
  getClientIp,
} from '@/lib/security';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const body = await request.json();
    const { email, code, newPass } = body;

    if (!email?.trim() || !code?.trim() || !newPass?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email, kode verifikasi, dan kata sandi baru wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Rate Limiting: Max 5 reset attempts per 10 minutes per IP/email
    const rateLimit = await checkRateLimit(`confirm-reset:${cleanEmail}:${ip}`, 5, 10 * 60);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terlalu banyak percobaan kode yang salah. Silakan minta kode baru.',
        },
        { status: 429 }
      );
    }

    if (newPass.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Kata sandi baru minimal harus 6 karakter.' },
        { status: 400 }
      );
    }

    const pending = await getPendingReset(cleanEmail);

    if (!pending) {
      return NextResponse.json(
        { success: false, error: 'Permintaan reset sandi tidak ditemukan atau kedaluwarsa. Silakan ulangi.' },
        { status: 400 }
      );
    }

    if (pending.code !== code.trim()) {
      return NextResponse.json(
        { success: false, error: 'Kode verifikasi 6 digit yang Anda masukkan salah.' },
        { status: 400 }
      );
    }

    // Check expiry (15 minutes)
    if (Date.now() - pending.createdAt > 15 * 60 * 1000) {
      await removePendingReset(cleanEmail);
      return NextResponse.json(
        { success: false, error: 'Kode verifikasi telah kedaluwarsa (lebih dari 15 menit). Silakan minta kode baru.' },
        { status: 400 }
      );
    }

    // Hash the new password with salted Scrypt
    const hashedPassword = hashPassword(newPass);

    // Update password in database
    const allUsers = await getAllUsers();
    const updatedUsers = allUsers.map((u) => {
      if (u.email.toLowerCase() === cleanEmail) {
        return { ...u, pass: hashedPassword };
      }
      return u;
    });

    await saveAllUsers(updatedUsers);
    await removePendingReset(cleanEmail);

    return NextResponse.json({
      success: true,
      message: 'Kata sandi berhasil diperbarui! Silakan masuk dengan kata sandi baru Anda.',
    });
  } catch (error: any) {
    console.error('Confirm reset error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat memperbarui kata sandi.' },
      { status: 500 }
    );
  }
}
