import { NextResponse } from 'next/server';
import { getUserCVs, saveUserCVs } from '@/lib/serverDb';

// GET /api/cv?userId=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
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
    const body = await request.json();
    const { userId, cvs } = body;

    if (!userId || !Array.isArray(cvs)) {
      return NextResponse.json({ success: false, error: 'userId and cvs are required' }, { status: 400 });
    }

    await saveUserCVs(userId, cvs);
    return NextResponse.json({ success: true, count: cvs.length });
  } catch (error: any) {
    console.error('Error saving CVs:', error);
    return NextResponse.json({ success: false, error: 'Failed to save CVs' }, { status: 500 });
  }
}
