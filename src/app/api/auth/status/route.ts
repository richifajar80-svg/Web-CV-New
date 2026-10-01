import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/serverDb';

export async function GET() {
  const redis = getRedisClient();
  const isRedisConnected = Boolean(redis);

  // Return minimal health check data without disclosing any customer personal info
  return NextResponse.json({
    status: 'ok',
    cloudStorage: isRedisConnected ? 'Upstash Redis Connected ✅' : 'In-Memory / Local Cache Fallback ⚠️',
    timestamp: new Date().toISOString(),
  });
}
