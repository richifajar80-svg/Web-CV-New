import { NextResponse } from 'next/server';
import { getAllUsers, saveAllUsers, UserRecord } from '@/lib/serverDb';

// GET: Retrieve all users for Admin Dashboard
export async function GET() {
  try {
    const users = await getAllUsers();
    // Return all users (masking passwords for safety)
    const safeUsers = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      isVerified: u.isVerified,
      isPaid: u.isPaid,
      subscriptionExpiresAt: u.subscriptionExpiresAt,
      createdAt: u.createdAt,
      pass: u.pass ? '••••••••' : undefined,
    }));

    return NextResponse.json({ success: true, users: safeUsers });
  } catch (error: any) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data pengguna.' },
      { status: 500 }
    );
  }
}

// POST: Admin toggle user subscription or delete user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, userId, isPaid } = body;

    const users = await getAllUsers();

    if (action === 'toggle-subscription') {
      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

      const updated = users.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            isPaid: isPaid ?? !u.isPaid,
            subscriptionExpiresAt: (isPaid ?? !u.isPaid) ? oneYearLater.toISOString() : undefined,
          };
        }
        return u;
      });

      await saveAllUsers(updated);
      return NextResponse.json({ success: true, users: updated });
    }

    if (action === 'delete-user') {
      const filtered = users.filter((u) => u.id !== userId);
      await saveAllUsers(filtered);
      return NextResponse.json({ success: true, users: filtered });
    }

    return NextResponse.json({ success: false, error: 'Aksi tidak valid.' }, { status: 400 });
  } catch (error: any) {
    console.error('Admin update user error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui status pengguna.' },
      { status: 500 }
    );
  }
}
