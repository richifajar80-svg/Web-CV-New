import { NextResponse } from 'next/server';
import { getAllUsers, setPendingReset } from '@/lib/serverDb';
import { sendVerificationEmail } from '@/lib/email';
import { checkRateLimit, getClientIp } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const body = await request.json();
    const { email } = body;

    if (!email?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Harap masukkan alamat email Anda.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Rate Limiting: Max 3 reset requests per 15 minutes per IP/email to protect Gmail SMTP
    const rateLimit = await checkRateLimit(`reset-pwd:${cleanEmail}:${ip}`, 3, 15 * 60);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terlalu banyak permintaan reset kata sandi. Silakan tunggu 15 menit sebelum meminta kembali.',
        },
        { status: 429 }
      );
    }

    const allUsers = await getAllUsers();
    const user = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      // Return 404 or generic message
      return NextResponse.json(
        { success: false, error: 'Email ini belum terdaftar di cvbagus.id.' },
        { status: 404 }
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await setPendingReset({
      email: cleanEmail,
      code,
      createdAt: Date.now(),
    });

    const mailResult = await sendVerificationEmail({
      to: cleanEmail,
      name: user.name,
      code,
      type: 'reset',
    });

    if (!mailResult.success) {
      console.warn('Reset email error:', mailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: `Kode reset kata sandi telah dikirim ke ${cleanEmail}.`,
    });
  } catch (error: any) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat meminta reset sandi.' },
      { status: 500 }
    );
  }
}
