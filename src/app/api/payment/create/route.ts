import { NextResponse } from 'next/server';
import { verifyUserToken, checkRateLimit, getClientIp } from '@/lib/security';
import { getAllUsers, savePaymentOrder, PaymentOrderRecord } from '@/lib/serverDb';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(`payment-create:${ip}`, 15, 60);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Terlalu banyak permintaan pembayaran. Silakan tunggu sebentar.' },
        { status: 429 }
      );
    }

    const authHeader = request.headers.get('authorization');
    const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : null;
    const verified = verifyUserToken(token);

    if (!verified) {
      return NextResponse.json(
        { success: false, error: 'Silakan masuk ke akun Anda terlebih dahulu sebelum melakukan pembayaran.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const plan: 'personal' | 'enterprise' = body.plan === 'enterprise' ? 'enterprise' : 'personal';
    const amount = plan === 'enterprise' ? 199000 : 25000;

    const allUsers = await getAllUsers();
    const user = allUsers.find((u) => u.id === verified.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Akun pengguna tidak ditemukan.' },
        { status: 404 }
      );
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();
    const clientKey =
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.trim() ||
      process.env.MIDTRANS_CLIENT_KEY?.trim() ||
      '';

    if (!serverKey) {
      return NextResponse.json(
        {
          success: false,
          notConfigured: true,
          error:
            'Gerbang pembayaran otomatis (Midtrans) sedang dalam pemeliharaan atau belum dikonfigurasi. Silakan hubungi Admin untuk aktivasi manual.',
        },
        { status: 503 }
      );
    }

    // Automatically detect Production vs Sandbox from key prefix or env flag
    const isProduction =
      process.env.MIDTRANS_IS_PRODUCTION === 'true' ||
      (!serverKey.startsWith('SB-') && process.env.MIDTRANS_IS_PRODUCTION !== 'false');

    const snapEndpoint = isProduction
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    const timestamp = Date.now();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    // Max 50 chars for Midtrans order_id
    const safeUserSuffix = user.id.replace(/[^a-zA-Z0-9]/g, '').slice(-8);
    const orderId = `CVB-${plan === 'enterprise' ? 'ENT' : 'PRO'}-${safeUserSuffix}-${timestamp}-${randomSuffix}`;

    const authString = Buffer.from(`${serverKey}:`).toString('base64');

    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      item_details: [
        {
          id: plan === 'enterprise' ? 'CVBAGUS-ENT-1Y' : 'CVBAGUS-PRO-1Y',
          price: amount,
          quantity: 1,
          name:
            plan === 'enterprise'
              ? 'Paket Enterprise CVBagus.id (1 Tahun)'
              : 'Paket Personal Full Access CVBagus.id (1 Tahun)',
        },
      ],
      customer_details: {
        first_name: user.name.slice(0, 45),
        email: user.email,
      },
      custom_field1: user.id,
      custom_field2: plan,
      expiry: {
        unit: 'minutes',
        duration: 60,
      },
    };

    const midtransRes = await fetch(snapEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(payload),
    });

    const midtransData = await midtransRes.json().catch(() => ({}));

    if (!midtransRes.ok || !midtransData.token) {
      console.error('[Midtrans Create Error]:', midtransData);
      return NextResponse.json(
        {
          success: false,
          error:
            midtransData.error_messages?.[0] ||
            'Gagal membuat transaksi pembayaran di Midtrans. Periksa konfigurasi Server Key.',
        },
        { status: 500 }
      );
    }

    const orderRecord: PaymentOrderRecord = {
      orderId,
      userId: user.id,
      email: user.email,
      plan,
      amount,
      status: 'pending',
      snapToken: midtransData.token,
      redirectUrl: midtransData.redirect_url,
      createdAt: timestamp,
    };

    await savePaymentOrder(orderRecord);

    return NextResponse.json({
      success: true,
      orderId,
      snapToken: midtransData.token,
      redirectUrl: midtransData.redirect_url,
      clientKey,
      isProduction,
    });
  } catch (error: any) {
    console.error('[Payment Create Exception]:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat menyiapkan pembayaran.' },
      { status: 500 }
    );
  }
}
