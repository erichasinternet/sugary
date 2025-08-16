import { v } from 'convex/values';
import { query } from './_generated/server';
import { auth } from './auth';

export const getSignupTrends = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    // Get user's company
    const company = await ctx.db
      .query('companies')
      .withIndex('by_owner', (q) => q.eq('ownerId', userId))
      .first();

    if (!company) return [];

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

