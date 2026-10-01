import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, code, type } = body;

    if (!email || !code || !type) {
      return NextResponse.json(
        { success: false, error: 'Email, code, dan type wajib diisi.' },
        { status: 400 }
      );
    }

    if (type !== 'register' && type !== 'reset') {
      return NextResponse.json(
        { success: false, error: 'Tipe verifikasi tidak valid.' },
        { status: 400 }
      );
    }

    const result = await sendVerificationEmail({
      to: email.trim().toLowerCase(),
      name: name?.trim(),
      code: code.trim(),
      type,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Gagal mengirim email verifikasi.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      simulated: result.simulated ?? false,
      message: result.simulated
        ? 'Email berhasil diproses (mode simulasi lokal).'
        : `Email verifikasi berhasil dikirim ke ${email}.`,
    });
  } catch (error: any) {
    console.error('Error on /api/auth/send-verification:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat mengirim email.' },
      { status: 500 }
    );
  }
}
