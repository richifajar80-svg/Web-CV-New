import { NextResponse } from 'next/server';
import { getAllUsers, saveAllUsers, getEffectiveUserQuotas, getCurrentMonthKey } from '@/lib/serverDb';
import { verifyUserToken } from '@/lib/security';
import { PLAN_LIMITS, UserPlan } from '@/types/auth';

export const runtime = 'nodejs';

function getUserFromToken(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  return verifyUserToken(token);
}

// GET: Fetch current user's quota usage & limits
export async function GET(request: Request) {
  try {
    const verified = getUserFromToken(request);
    if (!verified) {
      return NextResponse.json(
        { success: false, error: 'Sesi login tidak valid atau telah kedaluwarsa.' },
        { status: 401 }
      );
    }

    const allUsers = await getAllUsers();
    const foundIdx = allUsers.findIndex((u) => u.id === verified.userId);

    if (foundIdx === -1) {
      return NextResponse.json(
        { success: false, error: 'Pengguna tidak ditemukan.' },
        { status: 404 }
      );
    }

    const found = allUsers[foundIdx];
    const { user: effective, hasChanged } = getEffectiveUserQuotas(found);

    if (hasChanged) {
      allUsers[foundIdx] = effective;
      await saveAllUsers(allUsers);
    }

    const plan: UserPlan = (effective.plan === 'enterprise' ? 'enterprise' : 'personal');
    const limits = PLAN_LIMITS[plan];
    const isAdmin = effective.role === 'admin' || effective.email.toLowerCase().includes('admin');
    const isServerSubscriptionActive =
      isAdmin ||
      Boolean(
        effective.isPaid &&
          effective.subscriptionExpiresAt &&
          new Date(effective.subscriptionExpiresAt).getTime() > Date.now()
      );

    return NextResponse.json({
      success: true,
      quota: {
        plan,
        isAdmin,
        isPaid: isAdmin ? true : Boolean(effective.isPaid),
        subscriptionExpiresAt: effective.subscriptionExpiresAt || null,
        isSubscriptionActive: isServerSubscriptionActive,
        downloadsUsed: effective.downloadCountThisMonth || 0,
        downloadLimit: isAdmin ? 999999 : limits.downloadLimit,
        translatesUsed: effective.translateCountThisMonth || 0,
        translateLimit: isAdmin ? 999999 : limits.translateLimit,
        resetMonth: effective.lastQuotaResetMonth || getCurrentMonthKey(),
      },
    });
  } catch (error: any) {
    console.error('[User Quota GET Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil informasi kuota pengguna.' },
      { status: 500 }
    );
  }
}

// POST: Consume download quota
export async function POST(request: Request) {
  try {
    const verified = getUserFromToken(request);
    if (!verified) {
      return NextResponse.json(
        { success: false, error: 'Sesi login tidak valid atau telah kedaluwarsa.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { action } = body;

    const allUsers = await getAllUsers();
    const foundIdx = allUsers.findIndex((u) => u.id === verified.userId);

    if (foundIdx === -1) {
      return NextResponse.json(
        { success: false, error: 'Pengguna tidak ditemukan.' },
        { status: 404 }
      );
    }

    const found = allUsers[foundIdx];
    const { user: effective, hasChanged } = getEffectiveUserQuotas(found);

    const plan: UserPlan = (effective.plan === 'enterprise' ? 'enterprise' : 'personal');
    const limits = PLAN_LIMITS[plan];
    const isAdmin = effective.role === 'admin' || effective.email.toLowerCase().includes('admin');
    const isServerSubscriptionActive =
      isAdmin ||
      Boolean(
        effective.isPaid &&
          effective.subscriptionExpiresAt &&
          new Date(effective.subscriptionExpiresAt).getTime() > Date.now()
      );

    if (action === 'consume-download') {
      // STRICT SERVER-SIDE PAYMENT CHECK: Never allow unpaid users to consume download quota
      if (!isServerSubscriptionActive) {
        return NextResponse.json(
          {
            success: false,
            unpaid: true,
            error: 'Akses ditolak: Akun Anda belum aktif (Belum Bayar). Silakan aktifkan paket Rp 25.000/tahun terlebih dahulu.',
          },
          { status: 403 }
        );
      }

      const currentDownloads = effective.downloadCountThisMonth || 0;
      const downloadLimit = limits.downloadLimit;

      // Admins are unrestricted
      if (!isAdmin && currentDownloads >= downloadLimit) {
        return NextResponse.json(
          {
            success: false,
            quotaExceeded: true,
            error: `Batas unduh PDF bulan ini telah tercapai (${currentDownloads}/${downloadLimit}).`,
            plan,
            downloadsUsed: currentDownloads,
            downloadLimit,
          },
          { status: 403 }
        );
      }

      // Increment download counter
      effective.downloadCountThisMonth = currentDownloads + 1;
      allUsers[foundIdx] = effective;
      await saveAllUsers(allUsers);

      const remaining = isAdmin ? 999999 : Math.max(0, downloadLimit - effective.downloadCountThisMonth);

      return NextResponse.json({
        success: true,
        downloadsUsed: effective.downloadCountThisMonth,
        downloadLimit: isAdmin ? 999999 : downloadLimit,
        remainingDownloads: remaining,
        plan,
      });
    }

    return NextResponse.json({ success: false, error: 'Aksi kuota tidak dikenali.' }, { status: 400 });
  } catch (error: any) {
    console.error('[User Quota POST Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memproses kuota pengguna.' },
      { status: 500 }
    );
  }
}
