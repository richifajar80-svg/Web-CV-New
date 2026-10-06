import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/security';
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
      return NextResponse.json({
        success: true,
        mode: 'full_cv',
        translatedData,
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
