import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import { auth } from './auth';

const http = httpRouter();

auth.addHttpRoutes(http);

// Stripe webhook endpoint
http.route({
  path: '/stripe',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const signature = request.headers.get('stripe-signature') as string;
    const payload = await request.text();
    
    const result = await ctx.runAction(internal.stripe.fulfillWebhook, {
      signature,
      payload,
    });

    return result.success 
      ? new Response(null, { status: 200 })
      : new Response('Webhook Error', { status: 400 });
  }),
});

export default http;
