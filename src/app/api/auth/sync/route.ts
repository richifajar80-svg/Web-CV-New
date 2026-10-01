import { NextResponse } from 'next/server';
import { getAllUsers, saveAllUsers, UserRecord } from '@/lib/serverDb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { users } = body;

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    const currentServerUsers = await getAllUsers();
    let hasChanges = false;
    const merged = [...currentServerUsers];

    for (const clientUser of users) {
      if (!clientUser?.email) continue;
      const cleanEmail = clientUser.email.trim().toLowerCase();
      const existingIdx = merged.findIndex((u) => u.email.toLowerCase() === cleanEmail);

      if (existingIdx === -1) {
        // Add new user from client
        merged.push({
          id: clientUser.id || `usr-${Date.now()}`,
          name: clientUser.name || 'Pengguna',
          email: cleanEmail,
          pass: clientUser.pass || '',
          isVerified: clientUser.isVerified ?? true,
          isPaid: clientUser.isPaid ?? false,
          subscriptionExpiresAt: clientUser.subscriptionExpiresAt,
          createdAt: clientUser.createdAt || new Date().toISOString(),
        });
        hasChanges = true;
      } else {
        // Merge updates (e.g. isPaid or password)
        const existing = merged[existingIdx];
        if (clientUser.isPaid && !existing.isPaid) {
          merged[existingIdx] = {
            ...existing,
            isPaid: true,
            subscriptionExpiresAt: clientUser.subscriptionExpiresAt || existing.subscriptionExpiresAt,
          };
          hasChanges = true;
        }
        if (clientUser.pass && !existing.pass) {
          merged[existingIdx] = {
            ...existing,
            pass: clientUser.pass,
          };
          hasChanges = true;
        }
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
