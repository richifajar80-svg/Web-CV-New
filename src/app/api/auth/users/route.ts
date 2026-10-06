import { NextResponse } from 'next/server';
import { getAllUsers, saveAllUsers, UserRecord } from '@/lib/serverDb';
import { verifyAdminRequest, hashPassword } from '@/lib/security';

export const runtime = 'nodejs';

// GET: Retrieve all users for Admin Dashboard (Protected by Admin Token)
export async function GET(request: Request) {
  try {
    if (!verifyAdminRequest(request)) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak: sesi admin tidak valid atau telah kedaluwarsa.' },
        { status: 401 }
      );
    }

    const users = await getAllUsers();
    // Return all users (masking passwords for safety)
    const safeUsers = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role || (u.email.toLowerCase().includes('admin') ? 'admin' : 'user'),
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

// POST: Admin toggle subscription, delete user, or create/update user
export async function POST(request: Request) {
  try {
    if (!verifyAdminRequest(request)) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak: sesi admin tidak valid atau telah kedaluwarsa.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { action, userId, isPaid, name, email, pass, role } = body;

    const users = await getAllUsers();

    // 1. CREATE / UPSERT USER
    if (action === 'create-user' || action === 'upsert-user') {
      if (!email || typeof email !== 'string' || !email.trim()) {
        return NextResponse.json(
          { success: false, error: 'Email wajib diisi.' },
          { status: 400 }
        );
      }

      if (!pass || typeof pass !== 'string' || !pass.trim()) {
        return NextResponse.json(
          { success: false, error: 'Kata sandi wajib diisi.' },
          { status: 400 }
        );
      }

      const cleanEmail = email.trim().toLowerCase();
      const existingIdx = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);

      const isAccountPaid = isPaid ?? true;
      const hundredYearsLater = new Date();
      hundredYearsLater.setFullYear(hundredYearsLater.getFullYear() + 100);

      const targetRole = role || (cleanEmail.includes('admin') ? 'admin' : 'user');

      const userRecord: UserRecord = {
        id: existingIdx !== -1 ? users[existingIdx].id : `usr-${Date.now()}`,
        name: name?.trim() || (targetRole === 'admin' ? 'Administrator' : 'Pengguna Baru'),
        email: cleanEmail,
        pass: hashPassword(pass.trim()),
        isVerified: true,
        isPaid: isAccountPaid,
        role: targetRole,
        subscriptionExpiresAt: isAccountPaid ? hundredYearsLater.toISOString() : undefined,
        createdAt: existingIdx !== -1 ? users[existingIdx].createdAt : new Date().toISOString(),
      };

      let updated: UserRecord[];
      if (existingIdx !== -1) {
        updated = [...users];
        updated[existingIdx] = userRecord;
      } else {
        updated = [userRecord, ...users];
      }

      await saveAllUsers(updated);

      const safeCreated = {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        role: userRecord.role,
        isVerified: userRecord.isVerified,
        isPaid: userRecord.isPaid,
        subscriptionExpiresAt: userRecord.subscriptionExpiresAt,
        createdAt: userRecord.createdAt,
      };

      return NextResponse.json({
        success: true,
        message: existingIdx !== -1 ? 'Akun berhasil diperbarui.' : 'Akun berhasil dibuat.',
        user: safeCreated,
        users: updated.map((u) => ({
          ...u,
          role: u.role || (u.email.toLowerCase().includes('admin') ? 'admin' : 'user'),
          pass: '••••••••',
        })),
      });
    }

    // 2. TOGGLE USER SUBSCRIPTION
    if (action === 'toggle-subscription') {
      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

      const updated = users.map((u) => {
        if (u.id === userId) {
          const nextPaid = isPaid ?? !u.isPaid;
          return {
            ...u,
            isPaid: nextPaid,
            subscriptionExpiresAt: nextPaid ? oneYearLater.toISOString() : undefined,
          };
        }
        return u;
      });

      await saveAllUsers(updated);
      return NextResponse.json({ success: true, users: updated });
    }

    // 3. DELETE USER
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
