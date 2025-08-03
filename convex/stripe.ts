import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { auth } from './auth';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = mutation({
  args: {
    priceId: v.string(),
  },
  handler: async (ctx, { priceId }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const user = await ctx.db.get(userId);
    if (!user?.email) throw new Error('User email not found');

    const company = await ctx.db
      .query('companies')
      .withIndex('by_owner', (q) => q.eq('ownerId', userId))
      .first();

    if (!company) throw new Error('Company not found');

    let customerId = company.stripeCustomerId;

    // Create or retrieve Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          companyId: company._id,
          userId: userId,
        },
      });
      
      customerId = customer.id;
      
      // Update company with customer ID
      await ctx.db.patch(company._id, {
        stripeCustomerId: customerId,
      });
    }

    // Create checkout session with 14-day free trial
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL}/dashboard`,
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          companyId: company._id,
        },
      },
      allow_promotion_codes: true,
    });

    return { url: session.url };
  },
});

export const getSubscriptionStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const company = await ctx.db
      .query('companies')
      .withIndex('by_owner', (q) => q.eq('ownerId', userId))
      .first();

    if (!company) return null;

    return {
      subscriptionStatus: company.subscriptionStatus,
      trialEndsAt: company.trialEndsAt,
      subscriptionEndsAt: company.subscriptionEndsAt,
      hasActiveSubscription: company.subscriptionStatus === 'active' || company.subscriptionStatus === 'trialing',
    };
  },
});

export const handleStripeWebhook = mutation({
  args: {
    signature: v.string(),
    rawBody: v.string(),
  },
  handler: async (ctx, { signature, rawBody }) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err}`);
    }

    const subscription = event.data.object;
    const companyId = subscription.metadata?.companyId;

    if (!companyId) {
      console.log('No companyId in subscription metadata');
      return;
    }

    const company = await ctx.db.get(companyId);
    if (!company) {
      console.log(`Company not found: ${companyId}`);
      return;
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await ctx.db.patch(companyId, {
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          trialEndsAt: subscription.trial_end ? subscription.trial_end * 1000 : undefined,
          subscriptionEndsAt: subscription.current_period_end * 1000,
        });
        break;

      case 'customer.subscription.deleted':
        await ctx.db.patch(companyId, {
          subscriptionStatus: 'canceled',
          subscriptionEndsAt: subscription.ended_at * 1000,
        });
        break;

      case 'invoice.payment_succeeded':
        // Update subscription status on successful payment
        const invoiceSubscription = await stripe.subscriptions.retrieve(subscription.subscription);
        await ctx.db.patch(companyId, {
          subscriptionStatus: invoiceSubscription.status,
          subscriptionEndsAt: invoiceSubscription.current_period_end * 1000,
        });
        break;

      case 'invoice.payment_failed':
        // Handle failed payment
        const failedSubscription = await stripe.subscriptions.retrieve(subscription.subscription);
        await ctx.db.patch(companyId, {
          subscriptionStatus: failedSubscription.status,
        });
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  },
});