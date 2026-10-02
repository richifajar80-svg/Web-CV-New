import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/security';
import { translateJobDescriptionWithGemini } from '@/lib/gemini';

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
    const { text, role, company, targetLanguage } = body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { success: false, error: 'Teks deskripsi pekerjaan wajib diisi.' },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Panjang teks melebihi batas maksimal 5.000 karakter.' },
        { status: 400 }
      );
    }

    // Check custom API key provided by client header or payload
    const customApiKey =
      request.headers.get('x-gemini-key')?.trim() ||
      (typeof body.apiKey === 'string' ? body.apiKey.trim() : undefined);

    const translatedText = await translateJobDescriptionWithGemini(text, {
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

