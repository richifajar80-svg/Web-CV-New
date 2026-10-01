import { NextResponse } from 'next/server';
import { getAllUsers, saveAllUsers } from '@/lib/serverDb';
import { hashPassword, isPasswordHashed, checkRateLimit, getClientIp } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(`sync:${ip}`, 5, 10 * 60);

    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Terlalu banyak permintaan sinkronisasi.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { users } = body;

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    const currentServerUsers = await getAllUsers();
    let hasChanges = false;
    const merged = [...currentServerUsers];

    for (const clientUser of users) {
      if (!clientUser?.email || typeof clientUser.email !== 'string') continue;
      const cleanEmail = clientUser.email.trim().toLowerCase();
      const existingIdx = merged.findIndex((u) => u.email.toLowerCase() === cleanEmail);

      // Only import user if they do NOT exist on server yet (legacy client migration)
      if (existingIdx === -1) {
        const rawPass = clientUser.pass || '';
        const hashedPass = rawPass ? (isPasswordHashed(rawPass) ? rawPass : hashPassword(rawPass)) : '';

        // Security check: NEVER allow client sync to grant isPaid: true!
        merged.push({
          id: clientUser.id || `usr-${Date.now()}`,
          name: clientUser.name || 'Pengguna',
          email: cleanEmail,
          pass: hashedPass,
          isVerified: Boolean(clientUser.isVerified),
          isPaid: false, // Disallow client-side privilege escalation
          createdAt: clientUser.createdAt || new Date().toISOString(),
        });
        hasChanges = true;
      }
    }

    if (hasChanges) {
      await saveAllUsers(merged);
    }

    return NextResponse.json({
      success: true,
      totalUsers: merged.length,
    });
  } catch (error: any) {
    console.error('Sync API error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat sinkronisasi.' },
      { status: 500 }
    );
  }
}
