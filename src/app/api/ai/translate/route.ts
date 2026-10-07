import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp, verifyUserToken } from '@/lib/security';
import { getAllUsers, saveAllUsers, getEffectiveUserQuotas, UserRecord } from '@/lib/serverDb';
import { PLAN_LIMITS, UserPlan } from '@/types/auth';
import {
  translateJobDescriptionWithGemini,
  translateFullCVWithGemini,
  FullCVTranslateInput,
} from '@/lib/gemini';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    // Rate limit: max 25 translations per minute per IP
    const rateLimit = await checkRateLimit(`ai-translate:${ip}`, 25, 60);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terlalu banyak permintaan translate. Harap tunggu 1 menit sebelum mencoba lagi.',
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));

    // Check custom API key provided by client header or payload
    const customApiKey =
      request.headers.get('x-gemini-key')?.trim() ||
      (typeof body.apiKey === 'string' ? body.apiKey.trim() : undefined);

    // Check user authentication token for quota enforcement
    const authHeader = request.headers.get('authorization');
    const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : null;
    const verified = verifyUserToken(token);

    let callingUser: UserRecord | null = null;
    let allUsers: UserRecord[] = [];
    let userIdx = -1;

    if (verified) {
      allUsers = await getAllUsers();
      userIdx = allUsers.findIndex((u) => u.id === verified.userId);
      if (userIdx !== -1) {
        const { user: effective, hasChanged } = getEffectiveUserQuotas(allUsers[userIdx]);
        callingUser = effective;
        if (hasChanged) {
          allUsers[userIdx] = effective;
          await saveAllUsers(allUsers);
        }
      }
    }

    const isAdmin = callingUser ? (callingUser.role === 'admin' || callingUser.email.toLowerCase().includes('admin')) : false;

    // Quota Enforcement: Check translate quota
    if (callingUser && !isAdmin) {
      const plan: UserPlan = callingUser.plan === 'enterprise' ? 'enterprise' : 'personal';
      const limit = PLAN_LIMITS[plan].translateLimit;
      const currentTranslates = callingUser.translateCountThisMonth || 0;

      if (currentTranslates >= limit) {
        return NextResponse.json(
          {
            success: false,
            quotaExceeded: true,
            error: `Batas kuota AI Translate bulan ini telah tercapai (${currentTranslates}/${limit}). Kuota akan direset otomatis pada awal bulan depan.`,
            plan,
            translatesUsed: currentTranslates,
            translateLimit: limit,
          },
          { status: 403 }
        );
      }
    }

    // MODE 1: FULL CV TRANSLATION (1 Halaman Penuh)
    if (body.mode === 'full_cv') {
      const cvInput = body.cvData as FullCVTranslateInput;
      if (!cvInput || typeof cvInput !== 'object') {
        return NextResponse.json(
          { success: false, error: 'Data CV tidak valid.' },
          { status: 400 }
        );
      }

      const translatedData = await translateFullCVWithGemini(cvInput, { customApiKey });

      // Increment user quota on successful full CV translation
      if (callingUser && userIdx !== -1 && !isAdmin) {
        callingUser.translateCountThisMonth = (callingUser.translateCountThisMonth || 0) + 1;
        allUsers[userIdx] = callingUser;
        await saveAllUsers(allUsers);
      }

      const plan: UserPlan = callingUser?.plan === 'enterprise' ? 'enterprise' : 'personal';
      const limit = PLAN_LIMITS[plan].translateLimit;

      return NextResponse.json({
        success: true,
        mode: 'full_cv',
        translatedData,
        translatesUsed: callingUser?.translateCountThisMonth || 0,
        translateLimit: isAdmin ? 999999 : limit,
      });
    }

    // MODE 2: SINGLE TEXT / SECTION TRANSLATION
    const { text, role, company, targetLanguage, type } = body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { success: false, error: 'Teks wajib diisi.' },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Panjang teks melebihi batas maksimal 5.000 karakter.' },
        { status: 400 }
      );
    }

    const translatedText = await translateJobDescriptionWithGemini(text, {
      type: type === 'summary' ? 'summary' : 'experience',
      role: typeof role === 'string' ? role : undefined,
      company: typeof company === 'string' ? company : undefined,
      targetLanguage: typeof targetLanguage === 'string' ? targetLanguage : 'en',
      customApiKey,
    });

    return NextResponse.json({
      success: true,
      translatedText,
    });
  } catch (error: any) {
    console.error('[Gemini AI Translate Error]:', error);

    const isMissingOrInvalidKey =
      error.needsKey ||
      error.status === 400 ||
      error.message?.includes('API Key') ||
      error.message?.includes('API key');

    if (isMissingOrInvalidKey) {
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Google Gemini API Key belum disetel atau tidak valid.',
          needsKey: true,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Gagal menerjemahkan dengan Gemini AI. Silakan coba lagi.',
      },
      { status: 500 }
    );
  }
}
