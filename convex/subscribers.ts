import { v } from 'convex/values';
import { internal } from './_generated/api';
import { mutation, query } from './_generated/server';
import { getPlanFromSubscriptionStatus, canAddSubscriber, canAddTotalSubscriber } from '../lib/plans';

export const subscribe = mutation({
  args: {
    featureId: v.id('features'),
    email: v.string(),
    context: v.optional(v.string()),
  },
  handler: async (ctx, { featureId, email, context }) => {
    // Check if already subscribed
    const existing = await ctx.db
      .query('subscribers')
      .withIndex('by_email_and_feature', (q) => q.eq('email', email).eq('featureId', featureId))
      .first();

    if (existing) {
      throw new Error('Email is already subscribed to this feature');
    }

    // Get feature and company info to check limits
    const feature = await ctx.db.get(featureId);
    if (!feature) {
      throw new Error('Feature not found');
    }

    const company = await ctx.db.get(feature.companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    // Check plan limits for the company owner
    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_user', (q) => q.eq('userId', company.ownerId))
      .unique();
    
    const plan = getPlanFromSubscriptionStatus(subscription?.subscriptionStatus || null);
    
    // Count existing subscribers for this feature
    const existingSubscribers = await ctx.db
      .query('subscribers')
      .withIndex('by_feature', (q) => q.eq('featureId', featureId))
      .collect();

    if (!canAddSubscriber(existingSubscribers.length, plan)) {
      throw new Error(`Subscriber limit reached for this feature. Free plan allows up to 50 subscribers per feature. Upgrade to Pro for unlimited subscribers.`);
    }

    // Count total subscribers across all company features
    const companyFeatures = await ctx.db
      .query('features')
      .withIndex('by_company', (q) => q.eq('companyId', feature.companyId))
      .collect();

    let totalCompanySubscribers = 0;
    for (const companyFeature of companyFeatures) {
      const featureSubscribers = await ctx.db
        .query('subscribers')
        .withIndex('by_feature', (q) => q.eq('featureId', companyFeature._id))
        .collect();
      totalCompanySubscribers += featureSubscribers.length;
    }

    if (!canAddTotalSubscriber(totalCompanySubscribers, plan)) {
      throw new Error(`Total subscriber limit reached. Free plan allows up to 50 total subscribers. Upgrade to Pro for unlimited subscribers.`);
    }

    // Generate confirmation token
    const confirmationToken = crypto.randomUUID();

    const subscriberId = await ctx.db.insert('subscribers', {
      email,
      featureId,
      context,
      confirmed: false,
      confirmationToken,
      subscribedAt: Date.now(),
    });

    // Schedule confirmation email (feature and company already loaded above)
    await ctx.scheduler.runAfter(0, internal.emails.sendConfirmationEmail, {
      email,
      featureTitle: feature.title,
      companyName: company.name,
      confirmationToken,
    });

    return subscriberId;
  },
});

export const confirmSubscription = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, { token }) => {
    const subscriber = await ctx.db
      .query('subscribers')
      .withIndex('by_confirmation_token', (q) => q.eq('confirmationToken', token))
      .first();

    if (!subscriber) {
      throw new Error('Invalid confirmation token');
    }

    await ctx.db.patch(subscriber._id, {
      confirmed: true,
      confirmationToken: undefined,
    });

    return subscriber;
  },
});

export const getSubscribersByFeature = query({
  args: { featureId: v.id('features') },
  handler: async (ctx, { featureId }) => {
    return await ctx.db
      .query('subscribers')
      .withIndex('by_feature', (q) => q.eq('featureId', featureId))
      .collect();
  },
});
