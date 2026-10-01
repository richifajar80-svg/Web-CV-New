import { NextResponse } from 'next/server';
import { verifyAdminPin, createAdminToken, checkRateLimit, getClientIp } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(`admin-login:${ip}`, 5, 15 * 60);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terlalu banyak percobaan masuk admin. Akses dibatasi sementara selama 15 menit.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { pin } = body;

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Master PIN wajib diisi.' },
        { status: 400 }
      );
    }

    const isValid = verifyAdminPin(pin);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Master PIN admin salah. Silakan coba kembali.' },
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
