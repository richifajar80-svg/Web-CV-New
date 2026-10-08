import { NextResponse } from 'next/server';
import { getUserCVs, saveUserCVs } from '@/lib/serverDb';
import { verifyUserToken, checkRateLimit, getClientIp } from '@/lib/security';

// GET /api/cv?userId=...
export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId')?.trim();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
    }

    // Basic userId format validation
    if (userId.length > 100 || !/^[a-zA-Z0-9_\-.:@]+$/.test(userId)) {
      return NextResponse.json({ success: false, error: 'Invalid userId format' }, { status: 400 });
    }

    // Rate limit: max 60 GET requests per minute per IP
    const rateLimit = await checkRateLimit(`cv-get:${ip}`, 60, 60);
    if (!rateLimit.success) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }

    // Strict Cryptographic Session Verification (Zero Trust / IDOR Prevention)
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Otorisasi diperlukan: silakan masuk untuk mengakses data CV.' },
        { status: 401 }
      );
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const session = verifyUserToken(token);
    if (!session || session.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak: token otentikasi tidak cocok atau tidak valid.' },
        { status: 403 }
      );
    }

    const cvs = await getUserCVs(userId);
    return NextResponse.json({ success: true, cvs });
  } catch (error: any) {
    console.error('Error fetching CVs:', error);
    return NextResponse.json({ success: false, error: 'Failed to load CVs' }, { status: 500 });
  }
}

// POST /api/cv
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const body = await request.json();
    const { userId, cvs } = body;

    if (!userId || !Array.isArray(cvs)) {
      return NextResponse.json({ success: false, error: 'userId and cvs are required' }, { status: 400 });
    }

    // Rate limit: max 40 save requests per minute per IP
    const rateLimit = await checkRateLimit(`cv-post:${ip}`, 40, 60);
    if (!rateLimit.success) {
      return NextResponse.json({ success: false, error: 'Too many save requests' }, { status: 429 });
    }

    // Prevent storage bloat / abuse: limit maximum 50 CVs per user
    if (cvs.length > 50) {
      return NextResponse.json(
        { success: false, error: 'Jumlah CV melebihi batas maksimum (50 CV).' },
        { status: 400 }
      );
    }

    // Strict Cryptographic Session Verification (Zero Trust / IDOR Prevention)
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Otorisasi diperlukan: silakan masuk untuk menyimpan data CV.' },
        { status: 401 }
      );
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const session = verifyUserToken(token);
    if (!session || session.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak: token otentikasi tidak cocok atau tidak valid.' },
        { status: 403 }
      );
    }

    await saveUserCVs(userId, cvs);
    return NextResponse.json({ success: true, count: cvs.length });
  } catch (error: any) {
    console.error('Error saving CVs:', error);
    return NextResponse.json({ success: false, error: 'Failed to save CVs' }, { status: 500 });
  }
}
