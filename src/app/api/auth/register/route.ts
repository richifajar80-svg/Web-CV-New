import { NextResponse } from 'next/server';
import { getAllUsers, setPendingVerification } from '@/lib/serverDb';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, pass } = body;

    if (!name?.trim() || !email?.trim() || !pass?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Nama, email, dan kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUsers = await getAllUsers();
    const isTaken = existingUsers.some((u) => u.email.toLowerCase() === cleanEmail);

    if (isTaken) {
      return NextResponse.json(
        { success: false, error: 'Email ini sudah terdaftar. Silakan masuk dengan kata sandi Anda.' },
        { status: 400 }
      );
    }

    // Generate 6-digit verification code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in server pending database
    await setPendingVerification({
      name: name.trim(),
      email: cleanEmail,
      pass,
      code: otp,
      createdAt: Date.now(),
    });

    // Send real Gmail OTP
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
