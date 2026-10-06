import { NextResponse } from 'next/server';
import { verifyAdminPin, createAdminToken, checkRateLimit, getClientIp, verifyPassword } from '@/lib/security';
import { getAllUsers } from '@/lib/serverDb';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(`admin-login:${ip}`, 10, 15 * 60);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terlalu banyak percobaan masuk admin. Akses dibatasi sementara selama 15 menit.',
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { pin, email, pass } = body;

    if (!pin && !pass && !email) {
      return NextResponse.json(
        { success: false, error: 'Kredensial admin (PIN atau kata sandi) wajib diisi.' },
        { status: 400 }
      );
    }

    let isAuthorized = false;

    // 1. Direct Master PIN verification
    if (typeof pin === 'string' && pin.trim()) {
      if (verifyAdminPin(pin.trim())) {
        isAuthorized = true;
      }
    }

    // 2. Email & Password or Admin account verification
    if (!isAuthorized) {
      const candidatePass =
        typeof pass === 'string' && pass.trim()
          ? pass.trim()
          : typeof pin === 'string'
          ? pin.trim()
          : '';
      const candidateEmail =
        typeof email === 'string' && email.trim() ? email.trim().toLowerCase() : '';

      if (candidatePass) {
        const users = await getAllUsers();
        const matchingAdmin = users.find((u) => {
          const isRoleAdmin = u.role === 'admin' || u.email.toLowerCase().includes('admin');
          if (!isRoleAdmin) return false;
          if (candidateEmail && u.email.toLowerCase() !== candidateEmail) return false;
          return verifyPassword(candidatePass, u.pass);
        });

        if (matchingAdmin) {
          isAuthorized = true;
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Master PIN atau kata sandi admin salah. Silakan coba kembali.' },
        { status: 401 }
      );
    }

    const token = createAdminToken();

    return NextResponse.json({
      success: true,
      message: 'Autentikasi admin berhasil.',
      token,
    });
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat otentikasi admin.' },
      { status: 500 }
    );
  }
}
