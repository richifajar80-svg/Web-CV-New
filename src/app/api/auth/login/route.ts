import { NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/serverDb';

export async function POST(request: Request) {
  try {
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
    const allUsers = await getAllUsers();

    console.log(`[LOGIN] Attempt for email "${cleanEmail}". Total registered users found: ${allUsers.length}`);

    // Look for matching user
    const found = allUsers.find(
      (u) => u.email.trim().toLowerCase() === cleanEmail && (u.pass?.trim() === cleanPass)
    );

    if (!found) {
      // Check if user exists but wrong password vs user doesn't exist
      const userExists = allUsers.some((u) => u.email.trim().toLowerCase() === cleanEmail);
      if (userExists) {
        return NextResponse.json(
          { success: false, error: 'Kata sandi salah. Silakan periksa kembali atau gunakan fitur Lupa Kata Sandi.' },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Akun dengan email ini belum terdaftar di database online. Silakan daftar akun baru terlebih dahulu.' },
        { status: 404 }
      );
    }

    // Return safe user object
    const safeUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      isVerified: found.isVerified ?? true,
      isPaid: found.isPaid ?? false,
      subscriptionExpiresAt: found.subscriptionExpiresAt,
      createdAt: found.createdAt,
    };

    return NextResponse.json({
      success: true,
      message: 'Login berhasil!',
      user: safeUser,
    });
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat memproses login.' },
      { status: 500 }
    );
  }
}
