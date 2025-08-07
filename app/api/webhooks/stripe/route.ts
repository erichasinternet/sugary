import { NextRequest } from 'next/server';
import { api } from '@/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  try {
    const result = await convex.action(api.stripe.fulfillWebhook, {
      signature,
      payload: body,
    });

    return Response.json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook handler failed', { status: 400 });
  }
}