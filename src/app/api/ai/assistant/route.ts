import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp, verifyUserToken, isAdminUser } from '@/lib/security';
import { getAllUsers, saveAllUsers, getEffectiveUserQuotas, UserRecord } from '@/lib/serverDb';
import { PLAN_LIMITS, UserPlan } from '@/types/auth';
import {
  enhanceExperienceBulletsWithGemini,
  generateProfessionalSummaryWithGemini,
  analyzeJobMatchWithGemini,
  EnhanceBulletsInput,
  GenerateSummaryInput,
  JobMatchInput,
} from '@/lib/gemini';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    // Rate limit: max 30 requests per minute per IP
    const rateLimit = await checkRateLimit(`ai-assistant:${ip}`, 30, 60);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terlalu banyak permintaan AI. Harap tunggu 1 menit sebelum mencoba lagi.',
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { action } = body;

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

    // Require valid login session to prevent unauthenticated scraping
    if (!verified || !callingUser) {
      return NextResponse.json(
        {
          success: false,
          needsAuth: true,
          error: 'Silakan masuk atau daftar akun gratis terlebih dahulu untuk menggunakan fitur AI Asisten.',
        },
        { status: 401 }
      );
    }

    const isAdmin = isAdminUser(callingUser);

    // Quota Enforcement: Check monthly AI quota for non-admin users using server key
    if (callingUser && !isAdmin && !customApiKey) {
      const plan: UserPlan = callingUser.plan === 'enterprise' ? 'enterprise' : 'personal';
      const limit = PLAN_LIMITS[plan].translateLimit;
      const currentUsage = callingUser.translateCountThisMonth || 0;

      if (currentUsage >= limit) {
        return NextResponse.json(
          {
            success: false,
            quotaExceeded: true,
            error: `Batas kuota AI bulan ini telah tercapai (${currentUsage}/${limit}). Upgrade paket untuk kuota lebih banyak atau tunggu reset bulan depan.`,
            plan,
            used: currentUsage,
            limit,
          },
          { status: 403 }
        );
      }
    }

    // ACTION 1: ENHANCE EXPERIENCE BULLETS
    if (action === 'enhance_bullets') {
      const { role, company, rawNotes, language } = body as EnhanceBulletsInput;
      if (!rawNotes || typeof rawNotes !== 'string' || !rawNotes.trim()) {
        return NextResponse.json(
          { success: false, error: 'Catatan tugas pekerjaan wajib diisi.' },
          { status: 400 }
        );
      }

      const enhancedText = await enhanceExperienceBulletsWithGemini(
        { role, company, rawNotes, language },
        { customApiKey }
      );

      // Increment quota on success
      if (callingUser && userIdx !== -1 && !isAdmin && !customApiKey) {
        callingUser.translateCountThisMonth = (callingUser.translateCountThisMonth || 0) + 1;
        allUsers[userIdx] = callingUser;
        await saveAllUsers(allUsers);
      }

      return NextResponse.json({
        success: true,
        action: 'enhance_bullets',
        result: enhancedText,
        quotaUsed: callingUser?.translateCountThisMonth || 0,
      });
    }

    // ACTION 2: GENERATE PROFESSIONAL SUMMARY
    if (action === 'generate_summary') {
      const { jobTitle, experiences, skills, language } = body as GenerateSummaryInput;
      const summaryText = await generateProfessionalSummaryWithGemini(
        { jobTitle, experiences, skills, language },
        { customApiKey }
      );

      // Increment quota on success
      if (callingUser && userIdx !== -1 && !isAdmin && !customApiKey) {
        callingUser.translateCountThisMonth = (callingUser.translateCountThisMonth || 0) + 1;
        allUsers[userIdx] = callingUser;
        await saveAllUsers(allUsers);
      }

      return NextResponse.json({
        success: true,
        action: 'generate_summary',
        result: summaryText,
        quotaUsed: callingUser?.translateCountThisMonth || 0,
      });
    }

    // ACTION 3: ANALYZE JOB MATCH (ATS SCANNER)
    if (action === 'job_match') {
      const { jobDescription, candidateTitle, candidateSummary, candidateExperiences, candidateSkills } =
        body as JobMatchInput;

      if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
        return NextResponse.json(
          { success: false, error: 'Deskripsi lowongan kerja minimal 20 karakter.' },
          { status: 400 }
        );
      }

      const analysis = await analyzeJobMatchWithGemini(
        { jobDescription, candidateTitle, candidateSummary, candidateExperiences, candidateSkills },
        { customApiKey }
      );

      // Increment quota on success
      if (callingUser && userIdx !== -1 && !isAdmin && !customApiKey) {
        callingUser.translateCountThisMonth = (callingUser.translateCountThisMonth || 0) + 1;
        allUsers[userIdx] = callingUser;
        await saveAllUsers(allUsers);
      }

      return NextResponse.json({
        success: true,
        action: 'job_match',
        result: analysis,
        quotaUsed: callingUser?.translateCountThisMonth || 0,
      });
    }

    return NextResponse.json(
      { success: false, error: `Action '${action}' tidak dikenali.` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[AI Assistant API Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Gagal memproses permintaan AI. Silakan coba lagi.',
      },
      { status: 500 }
    );
  }
}
