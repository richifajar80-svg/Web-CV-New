import { NextResponse } from 'next/server';
import { getAllUsers, getPendingVerification, setPendingVerification } from '@/lib/serverDb';
import { sendVerificationEmail } from '@/lib/email';
import { hashPassword, checkRateLimit, getClientIp, generateSecureOTP } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const body = await request.json();
    const { name, email, pass, resend } = body;

    // 1. Rate Limiting: max 5 registration/resend requests per 10 minutes per IP
    const rateLimit = await checkRateLimit(`register:${ip}`, 5, 10 * 60);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terlalu banyak permintaan pendaftaran dari jaringan Anda. Harap tunggu beberapa menit.',
        },
        { status: 429 }
      );
    }

    // Handle OTP Resend using existing server-side PendingRecord
    if (resend && email?.trim()) {
      const cleanEmail = email.trim().toLowerCase();
      const existingPending = await getPendingVerification(cleanEmail);
      if (!existingPending) {
        return NextResponse.json(
          {
            success: false,
            error: 'Sesi verifikasi telah berakhir. Silakan daftar ulang.',
          },
          { status: 400 }
        );
      }

      const newOtp = generateSecureOTP();
      await setPendingVerification({
        ...existingPending,
        code: newOtp,
        createdAt: Date.now(),
      });

      const mailResult = await sendVerificationEmail({
        to: cleanEmail,
        name: existingPending.name,
        code: newOtp,
        type: 'register',
      });

      if (!mailResult.success) {
        console.warn('Resend email warning:', mailResult.error);
      }

      return NextResponse.json({
        success: true,
        message: `Kode verifikasi baru telah dikirim ke ${cleanEmail}`,
        email: cleanEmail,
      });
    }

    if (!name?.trim() || !email?.trim() || !pass?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Nama, email, dan kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: 'Format alamat email tidak valid.' },
        { status: 400 }
      );
    }

    if (pass.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Kata sandi minimal harus 6 karakter.' },
        { status: 400 }
      );
    }

    const existingUsers = await getAllUsers();
    const isTaken = existingUsers.some((u) => u.email.toLowerCase() === cleanEmail);

    if (isTaken) {
      return NextResponse.json(
        { success: false, error: 'Email ini sudah terdaftar. Silakan masuk menggunakan kata sandi Anda.' },
        { status: 400 }
      );
    }

    // 2. Generate secure 6-digit verification code (CSPRNG)
    const otp = generateSecureOTP();

    // 3. Store pending verification with one-way salted scrypt hash
    const hashedPassword = hashPassword(pass);

    await setPendingVerification({
      name: name.trim(),
      email: cleanEmail,
      pass: hashedPassword,
      code: otp,
      createdAt: Date.now(),
    });

    // 4. Send Gmail OTP
    const mailResult = await sendVerificationEmail({
      to: cleanEmail,
      name: name.trim(),
      code: otp,
      type: 'register',
    });

    if (!mailResult.success) {
      console.warn('Email warning:', mailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: `Kode verifikasi telah dikirim ke ${cleanEmail}`,
      email: cleanEmail,
    });
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat mendaftar.' },
      { status: 500 }
    );
  }
}
