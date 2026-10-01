import { NextResponse } from 'next/server';
import { getRedisClient, getAllUsers } from '@/lib/serverDb';

export async function GET() {
  const redis = getRedisClient();
  const isRedisConnected = Boolean(redis);
  const users = await getAllUsers();

  return NextResponse.json({
    status: 'ok',
    cloudStorage: isRedisConnected ? 'Upstash Redis Connected ✅' : 'In-Memory / Local Cache Fallback ⚠️',
    totalUsers: users.length,
    users: users.map((u) => ({
      email: u.email,
      name: u.name,
      isVerified: u.isVerified,
      isPaid: u.isPaid,
      hasPassword: Boolean(u.pass),
    })),
  });
}
