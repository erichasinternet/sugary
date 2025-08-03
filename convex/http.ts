import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { auth } from './auth';
import { api } from './_generated/api';

const http = httpRouter();

auth.addHttpRoutes(http);

// Stripe webhook endpoint
http.route({
  path: '/stripe/webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      return new Response('Missing stripe-signature header', { status: 400 });
    }

    const rawBody = await request.text();

    try {
      await ctx.runMutation(api.stripe.handleStripeWebhook, {
        signature,
        rawBody,
      });

      return new Response('OK', { status: 200 });
    } catch (error) {
      console.error('Webhook error:', error);
      return new Response('Webhook error', { status: 400 });
    }
  }),
});

export default http;
