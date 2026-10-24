import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyUserToken } from '@/lib/security';
import {
  getPaymentOrder,
  savePaymentOrder,
  getLatestUserPaymentOrder,
  activateUserPaidSubscription,
} from '@/lib/serverDb';

export const runtime = 'nodejs';

/**
 * Helper: Verify if Midtrans transaction status means the payment is settled/completed
 */
function isTransactionSettled(transactionStatus?: string, fraudStatus?: string): boolean {
  if (transactionStatus === 'settlement') return true;
  if (transactionStatus === 'capture' && (!fraudStatus || fraudStatus === 'accept')) return true;
  return false;
}

/**
 * POST /api/payment/webhook
 * Official Midtrans HTTP Notification Webhook Endpoint
 * Automatically activates the customer's 1-year Pro/Enterprise subscription within 1-2 seconds of payment.
 */
export async function POST(request: Request) {
  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();
    if (!serverKey) {
      return NextResponse.json(
        { success: false, error: 'MIDTRANS_SERVER_KEY is not configured' },
        { status: 503 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      custom_field1,
      custom_field2,
    } = body;

    if (!order_id || !status_code || !gross_amount || !signature_key) {
      return NextResponse.json(
        { success: false, error: 'Invalid Midtrans notification payload' },
        { status: 400 }
      );
    }

    // 1. Cryptographic SHA-512 Signature Verification: SHA512(order_id + status_code + gross_amount + ServerKey)
    const rawSignatureInput = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const expectedSignature = crypto
      .createHash('sha512')
      .update(rawSignatureInput)
      .digest('hex');

    const sigBuf = Buffer.from(String(signature_key), 'hex');
    const expBuf = Buffer.from(expectedSignature, 'hex');

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      console.warn(`[Midtrans Webhook] Invalid signature for order_id: ${order_id}`);
      return NextResponse.json(
        { success: false, error: 'Invalid signature key' },
        { status: 403 }
      );
    }

    const existingOrder = await getPaymentOrder(String(order_id));
    const userId = existingOrder?.userId || (typeof custom_field1 === 'string' ? custom_field1 : '');
    const paidAmount = Number(gross_amount) || 0;
    const plan: 'personal' | 'enterprise' =
      paidAmount >= 199000 &&
      (existingOrder?.plan === 'enterprise' ||
        custom_field2 === 'enterprise' ||
        String(order_id).startsWith('CVB-ENT-'))
        ? 'enterprise'
        : 'personal';

    if (!userId) {
      console.warn(`[Midtrans Webhook] Order ${order_id} has no associated userId`);
      return NextResponse.json(
        { success: false, error: 'Order user not found' },
        { status: 404 }
      );
    }

    // 2. Check if settled
    if (isTransactionSettled(transaction_status, fraud_status)) {
      await activateUserPaidSubscription(userId, plan);

      if (existingOrder) {
        await savePaymentOrder({
          ...existingOrder,
          status: 'paid',
          paidAt: Date.now(),
        });
      }

      console.log(`[Midtrans Webhook] Successfully activated ${plan} subscription for user ${userId} (order ${order_id})`);
      return NextResponse.json({
        success: true,
        status: 'paid',
        message: 'Subscription activated automatically',
      });
    }

    // 3. Handle expire / cancel / deny
    if (
      transaction_status === 'expire' ||
      transaction_status === 'cancel' ||
      transaction_status === 'deny'
    ) {
      if (existingOrder) {
        await savePaymentOrder({
          ...existingOrder,
          status: transaction_status === 'expire' ? 'expired' : 'failed',
        });
      }
    }

    return NextResponse.json({
      success: true,
      status: transaction_status,
    });
  } catch (error: any) {
    console.error('[Midtrans Webhook Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payment/webhook?orderId=...
 * Active Server-to-Server Midtrans Status Verification
 * Called by the frontend immediately after Snap popup closes or when user clicks "Saya Sudah Membayar".
 * Queries Midtrans API directly so account activates even if webhook URL hasn't fired yet.
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : null;
    const verified = verifyUserToken(token);

    if (!verified) {
      return NextResponse.json(
        { success: false, error: 'Sesi login tidak valid.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const requestedOrderId = searchParams.get('orderId')?.trim();

    const order = requestedOrderId
      ? await getPaymentOrder(requestedOrderId)
      : await getLatestUserPaymentOrder(verified.userId);

    if (!order || order.userId !== verified.userId) {
      return NextResponse.json({
        success: true,
        paid: false,
        message: 'Belum ada transaksi aktif ditemukan.',
      });
    }

    if (order.status === 'paid') {
      await activateUserPaidSubscription(verified.userId, order.plan);
      return NextResponse.json({
        success: true,
        paid: true,
        orderId: order.orderId,
        plan: order.plan,
      });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();
    if (!serverKey) {
      return NextResponse.json({
        success: true,
        paid: false,
        orderId: order.orderId,
      });
    }

    const isProduction =
      process.env.MIDTRANS_IS_PRODUCTION === 'true' ||
      (!serverKey.startsWith('SB-') && process.env.MIDTRANS_IS_PRODUCTION !== 'false');

    const statusUrl = isProduction
      ? `https://api.midtrans.com/v2/${encodeURIComponent(order.orderId)}/status`
      : `https://api.sandbox.midtrans.com/v2/${encodeURIComponent(order.orderId)}/status`;

    const authString = Buffer.from(`${serverKey}:`).toString('base64');

    const midtransRes = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${authString}`,
      },
      cache: 'no-store',
    });

    const statusData = await midtransRes.json().catch(() => ({}));

    if (isTransactionSettled(statusData.transaction_status, statusData.fraud_status)) {
      await activateUserPaidSubscription(verified.userId, order.plan);
      await savePaymentOrder({
        ...order,
        status: 'paid',
        paidAt: Date.now(),
      });

      return NextResponse.json({
        success: true,
        paid: true,
        orderId: order.orderId,
        plan: order.plan,
      });
    }

    return NextResponse.json({
      success: true,
      paid: false,
      transactionStatus: statusData.transaction_status || order.status,
      orderId: order.orderId,
    });
  } catch (error: any) {
    console.error('[Payment Status Check Error]:', error);
    return NextResponse.json(
      { success: false, paid: false, error: 'Gagal memeriksa status transaksi.' },
      { status: 500 }
    );
  }
}

