import { type NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { internal } from '../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  try {
    const result = await convex.action(internal.stripe.fulfillWebhook, {
      signature,
      payload: body,
    });

    return result.success 
      ? NextResponse.json({ received: true })
      : NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}