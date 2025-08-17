import { v } from 'convex/values';
import { internal } from './_generated/api';
import { mutation, query } from './_generated/server';
import { auth } from './auth';
import { getPlanFromSubscriptionStatus, canCreateFeature, canSendSubscriberUpdate, PLAN_LIMITS } from '../lib/plans';
import { getUserCompany, requireAuth, requireUserCompany, getUserPlan, getUserSubscription, getOwnedFeature } from './utils';

export const getMyFeatures = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const company = await getUserCompany(ctx, userId);
    if (!company) return [];

    // Get all features for the company with subscriber counts
    const features = await ctx.db
      .query('features')
      .withIndex('by_company', (q) => q.eq('companyId', company._id))
      .collect();

    // Add subscriber count, upvote count, and recent updates to each feature
    const featuresWithCounts = await Promise.all(
      features.map(async (feature) => {
        const [subscriberCount, upvoteCount, recentUpdate] = await Promise.all([
          ctx.db
            .query('subscribers')
            .withIndex('by_feature', (q) => q.eq('featureId', feature._id))
            .collect()
            .then((subs) => subs.length),
          ctx.db
            .query('upvotes')
            .withIndex('by_feature', (q) => q.eq('featureId', feature._id))
            .collect()
            .then((votes) => votes.length),
          ctx.db
            .query('updates')
            .withIndex('by_feature', (q) => q.eq('featureId', feature._id))
            .order('desc')
            .first()
        ]);

        return {
          ...feature,
          subscriberCount,
          upvoteCount,
          recentUpdate,
        };
      }),
    );

    return featuresWithCounts;
  },
});

export const getUsageStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const company = await getUserCompany(ctx, userId);
    if (!company) return null;

    const plan = await getUserPlan(ctx, userId);

    // Get all features for the company
    const features = await ctx.db
      .query('features')
      .withIndex('by_company', (q) => q.eq('companyId', company._id))
      .collect();

    const featureCount = features.length;

    // Count total subscribers across all features
    let totalSubscribers = 0;
    for (const feature of features) {
      const subscriberCount = await ctx.db
        .query('subscribers')
        .withIndex('by_feature', (q) => q.eq('featureId', feature._id))
        .collect()
        .then((subs) => subs.length);
      totalSubscribers += subscriberCount;
    }

    // Count total subscriber updates sent across all features
    let totalSubscriberUpdates = 0;
    let subscriberUpdatesThisMonth = 0;
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const startOfMonthTimestamp = startOfMonth.getTime();

    for (const feature of features) {
      const updates = await ctx.db
        .query('updates')
        .withIndex('by_feature', (q) => q.eq('featureId', feature._id))
        .collect();
      
      totalSubscriberUpdates += updates.length;
      
      // Count subscriber updates sent this month
      const monthlyUpdates = updates.filter(update => update.sentAt >= startOfMonthTimestamp);
      subscriberUpdatesThisMonth += monthlyUpdates.length;
    }

    return {
      plan,
      features: {
        used: featureCount,
        limit: PLAN_LIMITS[plan].maxFeatures,
      },
      totalSubscribers: {
        used: totalSubscribers,
        limit: PLAN_LIMITS[plan].maxTotalSubscribers,
      },
      totalSubscriberUpdates,
      subscriberUpdates: {
        usedThisMonth: subscriberUpdatesThisMonth,
        limit: PLAN_LIMITS[plan].maxSubscriberUpdatesPerMonth,
      },
    };
  },
});

export const createFeature = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { title, slug, description }) => {
    const userId = await auth.getUserId(ctx);
    const company = await requireUserCompany(ctx, userId);

    // Check if feature slug already exists for this company
    const existing = await ctx.db
      .query('features')
      .withIndex('by_company_and_slug', (q) => q.eq('companyId', company._id).eq('slug', slug))
      .first();

    if (existing) {
      throw new Error('Feature slug already exists for this company');
    }

    // Check plan limits
    const plan = await getUserPlan(ctx, requireAuth(userId));
    
    // Count existing features
    const existingFeatures = await ctx.db
      .query('features')
      .withIndex('by_company', (q) => q.eq('companyId', company._id))
      .collect();

    if (!canCreateFeature(existingFeatures.length, plan)) {
      throw new Error(`Feature limit reached. Free plan allows up to 3 features. Upgrade to Pro for unlimited features.`);
    }

    const now = Date.now();
    return await ctx.db.insert('features', {
      title,
      slug,
      description,
      companyId: company._id,
      status: 'todo',
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getFeatureBySlug = query({
  args: {
    companySlug: v.string(),
    featureSlug: v.string(),
  },
  handler: async (ctx, { companySlug, featureSlug }) => {
    // Get company by slug
    const company = await ctx.db
      .query('companies')
      .withIndex('by_slug', (q) => q.eq('slug', companySlug))
      .first();

    if (!company) return null;

    // Get feature by company and slug
    const feature = await ctx.db
      .query('features')
      .withIndex('by_company_and_slug', (q) =>
        q.eq('companyId', company._id).eq('slug', featureSlug),
      )
      .first();

    if (!feature) return null;

    return {
      ...feature,
      company,
    };
  },
});

export const getFeatureDetails = query({
  args: { featureId: v.id('features') },
  handler: async (ctx, { featureId }) => {
    const userId = await auth.getUserId(ctx);
    const ownedFeature = await getOwnedFeature(ctx, requireAuth(userId), featureId);
    
    if (!ownedFeature) {
      throw new Error('Feature not found or not authorized to view this feature');
    }

    const { feature, company } = ownedFeature;

    // Get subscribers
    const subscribers = await ctx.db
      .query('subscribers')
      .withIndex('by_feature', (q) => q.eq('featureId', featureId))
      .collect();

    return {
      ...feature,
      company,
      subscribers,
    };
  },
});

export const updateFeatureStatus = mutation({
  args: {
    featureId: v.id('features'),
    status: v.union(v.literal('todo'), v.literal('requested'), v.literal('in_progress'), v.literal('done'), v.literal('cancelled')),
  },
  handler: async (ctx, { featureId, status }) => {
    const userId = await auth.getUserId(ctx);
    const ownedFeature = await getOwnedFeature(ctx, requireAuth(userId), featureId);
    
    if (!ownedFeature) {
      throw new Error('Feature not found or not authorized to update this feature');
    }

    const { feature } = ownedFeature;

    // Update the feature status
    await ctx.db.patch(featureId, {
      status,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});


export const sendFeatureUpdate = mutation({
  args: {
    featureId: v.id('features'),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { featureId, title, content }) => {
    const userId = await auth.getUserId(ctx);
    const ownedFeature = await getOwnedFeature(ctx, requireAuth(userId), featureId);
    
    if (!ownedFeature) {
      throw new Error('Feature not found or not authorized to update this feature');
    }

    const { feature, company } = ownedFeature;

    // Check subscriber update limits for free plan users
    const plan = await getUserPlan(ctx, requireAuth(userId));
    
    if (plan === 'free') {
      // Count subscriber updates sent this month across all user's features
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const startOfMonthTimestamp = startOfMonth.getTime();

      const userFeatures = await ctx.db
        .query('features')
        .withIndex('by_company', (q) => q.eq('companyId', company._id))
        .collect();

      let subscriberUpdatesThisMonth = 0;
      for (const userFeature of userFeatures) {
        const monthlySubscriberUpdates = await ctx.db
          .query('updates')
          .withIndex('by_feature', (q) => q.eq('featureId', userFeature._id))
          .filter((q) => q.gte(q.field('sentAt'), startOfMonthTimestamp))
          .collect();
        subscriberUpdatesThisMonth += monthlySubscriberUpdates.length;
      }

      if (!canSendSubscriberUpdate(subscriberUpdatesThisMonth, plan)) {
        throw new Error('Email campaign limit reached. Free plan allows up to 5 email campaigns per month. Upgrade to Pro for unlimited email campaigns.');
      }
    }

    // Get confirmed subscribers
    const subscribers = await ctx.db
      .query('subscribers')
      .withIndex('by_feature', (q) => q.eq('featureId', featureId))
      .filter((q) => q.eq(q.field('confirmed'), true))
      .collect();

    const confirmedEmails = subscribers.map((s) => s.email);

    if (confirmedEmails.length > 0) {
      // Schedule the update email
      await ctx.scheduler.runAfter(0, internal.emails.sendFeatureUpdateEmail, {
        emails: confirmedEmails,
        featureTitle: feature.title,
        companyName: company.name,
        updateTitle: title,
        updateContent: content,
      });
    }

    // Store the update in the database
    const updateId = await ctx.db.insert('updates', {
      featureId,
      title,
      content,
      sentAt: Date.now(),
      recipientCount: confirmedEmails.length,
    });

    return { updateId, recipientCount: confirmedEmails.length };
  },
});

export const getSignupTrends = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    const company = await requireUserCompany(ctx, userId);

    // Get all features for the company
    const features = await ctx.db
      .query('features')
      .withIndex('by_company', (q) => q.eq('companyId', company._id))
      .collect();

    const featureIds = features.map((f) => f._id);

    // Get all subscribers for company's features
    const subscribers = await ctx.db.query('subscribers').collect();

    const companySubscribers = subscribers.filter((s) => featureIds.includes(s.featureId));

    // Group by day for the last 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentSubscribers = companySubscribers.filter((s) => s.subscribedAt >= thirtyDaysAgo);

    // Create daily buckets
    const dailySignups: Record<string, number> = {};

    for (let i = 0; i < 30; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().split('T')[0];
      dailySignups[dateKey] = 0;
    }

    recentSubscribers.forEach((subscriber) => {
      const date = new Date(subscriber.subscribedAt);
      const dateKey = date.toISOString().split('T')[0];
      if (dailySignups[dateKey] !== undefined) {
        dailySignups[dateKey]++;
      }
    });

    return Object.entries(dailySignups)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },
});
