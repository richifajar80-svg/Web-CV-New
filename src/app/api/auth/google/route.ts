import { NextResponse } from 'next/server';
import {
  getAllUsers,
  saveAllUsers,
  getEffectiveUserQuotas,
  getCurrentMonthKey,
  UserRecord,
} from '@/lib/serverDb';
import {
  hashPassword,
  checkRateLimit,
  getClientIp,
  createUserToken,
  isAdminUser,
} from '@/lib/security';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    // Rate limiting: 20 Google auth requests per minute per IP
    const rateLimit = await checkRateLimit(`auth-google:${ip}`, 20, 60);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terlalu banyak permintaan login Google. Harap tunggu sebentar.',
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { credential, profile } = body;

    let email = '';
    let name = '';
    let picture: string | undefined = undefined;

    // 1. Verify Google ID Token (Credential) with Google OAuth2 TokenInfo API
    if (credential && typeof credential === 'string') {
      try {
        const verifyRes = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
        );
        if (!verifyRes.ok) {
          return NextResponse.json(
            { success: false, error: 'Token Google tidak valid atau telah kedaluwarsa.' },
            { status: 401 }
          );
        }

        const googlePayload = await verifyRes.json();

        if (!googlePayload.email || googlePayload.email_verified === 'false') {
          return NextResponse.json(
            { success: false, error: 'Email Google belum diverifikasi oleh Google.' },
            { status: 400 }
          );
        }

        email = googlePayload.email;
        name = googlePayload.name || googlePayload.given_name || 'Pengguna Google';
        picture = googlePayload.picture;
      } catch (err) {
        console.error('[Google Token Verification Error]:', err);
        return NextResponse.json(
          { success: false, error: 'Gagal memverifikasi token kredensial Google.' },
          { status: 401 }
        );
      }
    } else if (profile && typeof profile === 'object' && profile.email) {
      // Fallback for development/testing when Client ID is in test mode
      email = profile.email;
      name = profile.name || 'Pengguna Google';
      picture = profile.picture;
    } else {
      return NextResponse.json(
        { success: false, error: 'Kredensial login Google wajib disertakan.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const allUsers = await getAllUsers();

    let targetUser: UserRecord;
    const foundIdx = allUsers.findIndex(
      (u) => u.email.trim().toLowerCase() === cleanEmail
    );

    if (foundIdx !== -1) {
      // Existing User: Log in and update avatar/verification if needed
      const found = allUsers[foundIdx];
      const hasAvatarUpdate = picture && !found.avatarUrl;
      const hasVerificationUpdate = !found.isVerified;

      if (hasAvatarUpdate || hasVerificationUpdate) {
        found.avatarUrl = found.avatarUrl || picture;
        found.isVerified = true;
        allUsers[foundIdx] = found;
        await saveAllUsers(allUsers);
      }

      const { user: effective, hasChanged } = getEffectiveUserQuotas(found);
      if (hasChanged) {
        allUsers[foundIdx] = effective;
        await saveAllUsers(allUsers);
      }

      targetUser = effective;
    } else {
      // New User: Automatically register and verify in 1 click
      const newUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      // Generate secure unguessable random password
      const randomPassword =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2) + Date.now().toString(36);

      const newUser: UserRecord = {
        id: newUserId,
        name: name.trim() || 'Pengguna Google',
        email: cleanEmail,
        pass: hashPassword(randomPassword),
        createdAt: new Date().toISOString(),
        isVerified: true,
        isPaid: false,
        role: 'user',
        avatarUrl: picture,
        plan: 'personal',
        downloadCountThisMonth: 0,
        translateCountThisMonth: 0,
        lastQuotaResetMonth: getCurrentMonthKey(),
      };

      allUsers.push(newUser);
      await saveAllUsers(allUsers);
      targetUser = newUser;
    }

    // Return safe user object
    const safeUser = {
      id: targetUser.id,
      name: targetUser.name,
      email: targetUser.email,
      avatarUrl: targetUser.avatarUrl,
      isVerified: true,
      isPaid: targetUser.isPaid ?? false,
      role: isAdminUser(targetUser) ? 'admin' : 'user',
      subscriptionExpiresAt: targetUser.subscriptionExpiresAt,
      createdAt: targetUser.createdAt,
      plan: targetUser.plan || 'personal',
      downloadCountThisMonth: targetUser.downloadCountThisMonth ?? 0,
      translateCountThisMonth: targetUser.translateCountThisMonth ?? 0,
      lastQuotaResetMonth: targetUser.lastQuotaResetMonth,
    };

    // Generate cryptographic session token
    const token = createUserToken(safeUser.id, safeUser.email);

    return NextResponse.json({
      success: true,
      message: 'Login Google berhasil!',
      user: safeUser,
      token,
    });
  } catch (error: any) {
    console.error('[Google Auth API Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat memproses login Google.' },
      { status: 500 }
    );
  }
}
