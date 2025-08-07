import { v } from 'convex/values';
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  query,
} from './_generated/server';
import { ConvexError } from 'convex/values';
import { auth } from './auth';
import { internal } from './_generated/api';

// Initialize Stripe with the secret key
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Action to create checkout session (external API call)
export const createCheckoutSession = action({
  args: {
    priceId: v.string(),
    mode: v.union(v.literal('subscription'), v.literal('payment')),
    trialPeriodDays: v.optional(v.number()),
  },
  handler: async (ctx, { priceId, mode, trialPeriodDays }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new ConvexError('Not authenticated');
    }

    const user = await ctx.runQuery(internal.stripe.getUser, { userId });
    if (!user) {
      throw new ConvexError('User not found');
    }

    try {
      const sessionConfig: any = {
        mode,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${process.env.SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.SITE_URL}/dashboard`,
        customer_email: user.email,
        metadata: {
          userId: userId,
        },
      };

      if (mode === 'subscription' && trialPeriodDays) {
        sessionConfig.subscription_data = {
          trial_period_days: trialPeriodDays,
        };
      }

      const session = await stripe.checkout.sessions.create(sessionConfig);

      return { url: session.url };
    } catch (error) {
      console.error('Stripe checkout session creation failed:', error);
      throw new ConvexError('Failed to create checkout session');
    }
  },
});

// Query to get subscription status
export const getSubscriptionStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }

    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .unique();

    if (!subscription) {
      return {
        hasActiveSubscription: false,
        subscriptionStatus: 'none',
        trialEndsAt: null,
        isNewUser: true, // Users without subscriptions are considered new
        hasPaymentMethod: false,
      };
    }

    // Check if trial has expired and should be downgraded
    const now = Date.now();
    const trialExpired = subscription.trialEndsAt && now > subscription.trialEndsAt;
    const shouldBeDowngraded = subscription.subscriptionStatus === 'trialing' && trialExpired;

    return {
      hasActiveSubscription:
        ['active', 'trialing'].includes(subscription.subscriptionStatus) && !shouldBeDowngraded,
      subscriptionStatus: shouldBeDowngraded ? 'canceled' : subscription.subscriptionStatus,
      trialEndsAt: subscription.trialEndsAt,
      currentPeriodEnd: subscription.currentPeriodEnd,
      trialExpired: shouldBeDowngraded,
      isNewUser: false,
      hasPaymentMethod: subscription.paymentMethodRequired || false, // This tracks if payment method is attached
      stripeCustomerId: subscription.stripeCustomerId,
    };
  },
});

// Action to check if customer has payment method
export const checkPaymentMethod = action({
  args: {},
  handler: async (ctx): Promise<{ hasPaymentMethod: boolean }> => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return { hasPaymentMethod: false };
    }

    const subscription = await ctx.runQuery(internal.stripe.getUserSubscription, { userId });
    if (!subscription || !subscription.stripeCustomerId) {
      return { hasPaymentMethod: false };
    }

    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: subscription.stripeCustomerId,
        type: 'card',
      });

      return { hasPaymentMethod: paymentMethods.data.length > 0 };
    } catch (error) {
      console.error('Failed to check payment methods:', error);
      return { hasPaymentMethod: false };
    }
  },
});

// Action to create billing portal session
export const createBillingPortalSession = action({
  args: {},
  handler: async (ctx): Promise<{ url: string }> => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new ConvexError('Not authenticated');
    }

    const subscription = await ctx.runQuery(internal.stripe.getUserSubscription, { userId });
    if (!subscription || !subscription.stripeCustomerId) {
      throw new ConvexError('No subscription found');
    }

    try {
      const session: any = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: `${process.env.SITE_URL}/dashboard/billing`,
      });

      return { url: session.url };
    } catch (error) {
      console.error('Failed to create billing portal session:', error);
      throw new ConvexError('Failed to create billing portal session');
    }
  },
});

// Internal action to automatically create trial subscription for new users
export const autoCreateTrialSubscription = internalAction({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }): Promise<{ subscriptionId: string | null }> => {
    const user: any = await ctx.runQuery(internal.stripe.getUser, { userId });
    if (!user) {
      console.error('User not found for auto trial creation:', userId);
      return { subscriptionId: null };
    }

    // Check if user already has a subscription
    const existingSubscription = await ctx.runQuery(internal.stripe.getUserSubscription, {
      userId,
    });
    if (existingSubscription) {
      return { subscriptionId: existingSubscription.stripeSubscriptionId || null };
    }

    try {
      // Create customer in Stripe
      const customer: any = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: userId,
        },
      });

      // Create subscription with 14-day trial (no credit card required) - default to monthly
      const subscription: any = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID }],
        trial_period_days: 14,
        payment_behavior: 'allow_incomplete',
        payment_settings: {
          save_default_payment_method: 'off', // Don't require payment method during trial
        },
        trial_settings: {
          end_behavior: {
            missing_payment_method: 'cancel', // Cancel when trial ends without payment
          },
        },
        expand: ['latest_invoice'],
      });

      // Store subscription in database via internal mutation
      await ctx.runMutation(internal.stripe.createSubscriptionRecord, {
        userId: userId,
        stripeCustomerId: customer.id,
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: 'trialing' as const,
        trialEndsAt: new Date(subscription.trial_end! * 1000).getTime(),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).getTime(),
      });

      return {
        subscriptionId: subscription.id,
      };
    } catch (error) {
      console.error('Failed to auto-create trial subscription:', error);
      // Don't throw error - let user proceed without trial
      return { subscriptionId: null };
    }
  },
});

// Action to create trial subscription (external API call) - kept for manual trial creation
export const createTrialSubscription = action({
  args: {},
  handler: async (ctx): Promise<{ subscriptionId: string; clientSecret?: string }> => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new ConvexError('Not authenticated');
    }

    const user: any = await ctx.runQuery(internal.stripe.getUser, { userId });
    if (!user) {
      throw new ConvexError('User not found');
    }

    // Check if user already has a subscription
    const existingSubscription = await ctx.runQuery(internal.stripe.getUserSubscription, {
      userId,
    });
    if (existingSubscription) {
      throw new ConvexError('User already has a subscription');
    }

    try {
      // Create customer in Stripe
      const customer: any = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: userId,
        },
      });

      // Create subscription with 14-day trial (no credit card required) - default to monthly
      const subscription: any = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID }],
        trial_period_days: 14,
        payment_behavior: 'allow_incomplete',
        payment_settings: {
          save_default_payment_method: 'off', // Don't require payment method during trial
        },
        trial_settings: {
          end_behavior: {
            missing_payment_method: 'cancel', // Cancel when trial ends without payment
          },
        },
        expand: ['latest_invoice'],
      });

      // Store subscription in database via internal mutation
      await ctx.runMutation(internal.stripe.createSubscriptionRecord, {
        userId: userId,
        stripeCustomerId: customer.id,
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: 'trialing' as const,
        trialEndsAt: new Date(subscription.trial_end! * 1000).getTime(),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).getTime(),
      });

      return {
        subscriptionId: subscription.id,
        // No client secret needed since no payment required
      };
    } catch (error) {
      console.error('Failed to create trial subscription:', error);
      throw new ConvexError('Failed to create trial subscription');
    }
  },
});

// Internal mutation to create subscription record
export const createSubscriptionRecord = internalMutation({
  args: {
    userId: v.id('users'),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    subscriptionStatus: v.union(
      v.literal('trialing'),
      v.literal('active'),
      v.literal('canceled'),
      v.literal('incomplete'),
      v.literal('incomplete_expired'),
      v.literal('past_due'),
      v.literal('unpaid'),
    ),
    trialEndsAt: v.number(),
    currentPeriodEnd: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.insert('subscriptions', {
      ...args,
      trialStartedAt: now,
      cancelAtPeriodEnd: false,
      paymentMethodRequired: false,
      trialRemindersSent: [],
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Internal query to get user
export const getUser = internalQuery({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

// Internal query to get user subscription
export const getUserSubscription = internalQuery({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query('subscriptions')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .unique();
  },
});

// Internal mutation to update subscription from webhook
export const updateSubscriptionFromWebhook = internalMutation({
  args: {
    stripeSubscriptionId: v.string(),
    status: v.string(),
    currentPeriodEnd: v.number(),
    trialEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.boolean(),
  },
  handler: async (
    ctx,
    { stripeSubscriptionId, status, currentPeriodEnd, trialEnd, cancelAtPeriodEnd },
  ) => {
    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_stripe_subscription', (q) =>
        q.eq('stripeSubscriptionId', stripeSubscriptionId),
      )
      .unique();

    if (!subscription) {
      console.error('Subscription not found for Stripe ID:', stripeSubscriptionId);
      return;
    }

    await ctx.db.patch(subscription._id, {
      subscriptionStatus: status as any,
      currentPeriodEnd,
      trialEndsAt: trialEnd || undefined,
      cancelAtPeriodEnd,
      updatedAt: Date.now(),
    });
  },
});

// HTTP action to handle webhook fulfillment (callable from Next.js API routes)
export const fulfillWebhook = action({
  args: {
    signature: v.string(),
    payload: v.string(),
  },
  handler: async (ctx, { signature, payload }) => {
    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return { success: false };
    }

    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          const subscription = event.data.object as any;
          await ctx.runMutation(internal.stripe.updateSubscriptionFromWebhook, {
            stripeSubscriptionId: subscription.id,
            status: subscription.status,
            currentPeriodEnd: subscription.current_period_end * 1000,
            trialEnd: subscription.trial_end ? subscription.trial_end * 1000 : undefined,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          });
          break;

        case 'customer.subscription.deleted':
          const deletedSubscription = event.data.object as any;
          await ctx.runMutation(internal.stripe.updateSubscriptionFromWebhook, {
            stripeSubscriptionId: deletedSubscription.id,
            status: 'canceled',
            currentPeriodEnd: deletedSubscription.current_period_end * 1000,
            trialEnd: undefined,
            cancelAtPeriodEnd: false,
          });
          break;

        case 'customer.subscription.trial_will_end':
          // Handle trial ending soon (3 days before)
          const trialSubscription = event.data.object as any;
          console.log(`Trial ending soon for subscription ${trialSubscription.id}`);
          // This could trigger reminder emails
          break;

        case 'invoice.payment_succeeded':
          const invoice = event.data.object as any;
          if (invoice.subscription) {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription) as any;
            await ctx.runMutation(internal.stripe.updateSubscriptionFromWebhook, {
              stripeSubscriptionId: subscription.id,
              status: subscription.status,
              currentPeriodEnd: subscription.current_period_end * 1000,
              trialEnd: subscription.trial_end ? subscription.trial_end * 1000 : undefined,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            });
          }
          break;

        case 'invoice.payment_failed':
          const failedInvoice = event.data.object as any;
          if (failedInvoice.subscription) {
            const subscription = await stripe.subscriptions.retrieve(failedInvoice.subscription) as any;
            await ctx.runMutation(internal.stripe.updateSubscriptionFromWebhook, {
              stripeSubscriptionId: subscription.id,
              status: subscription.status,
              currentPeriodEnd: subscription.current_period_end * 1000,
              trialEnd: subscription.trial_end ? subscription.trial_end * 1000 : undefined,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            });
          }
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Webhook handler error:', error);
      return { success: false };
    }
  },
});
