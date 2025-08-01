import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { auth } from './auth';

// Simple mutation to track any analytics event (no useEffect needed)
export const trackAnalytics = mutation({
  args: {
    featureId: v.id('features'),
    type: v.union(
      v.literal('page_view'),
      v.literal('email_click'), 
      v.literal('social_share'),
      v.literal('signup_started'),
      v.literal('signup_completed')
    ),
    metadata: v.optional(v.object({
      referrer: v.optional(v.string()),
      userAgent: v.optional(v.string()),
      ipAddress: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    // Public endpoint - no auth required for tracking
    
    // Basic deduplication for page views
    if (args.type === 'page_view' && args.metadata?.ipAddress) {
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      const recentView = await ctx.db
        .query('clicks')
        .withIndex('by_feature_and_timestamp', (q) =>
          q.eq('featureId', args.featureId).gte('timestamp', fiveMinutesAgo)
        )
        .filter((q) => q.eq(q.field('ipAddress'), args.metadata?.ipAddress))
        .filter((q) => q.eq(q.field('type'), 'page_view'))
        .first();
      
      if (recentView) return recentView._id; // Don't track duplicate
    }

    return await ctx.db.insert('clicks', {
      featureId: args.featureId,
      type: args.type,
      ipAddress: args.metadata?.ipAddress,
      userAgent: args.metadata?.userAgent,
      referrer: args.metadata?.referrer,
      timestamp: Date.now(),
    });
  },
});

// Comprehensive analytics for the dashboard
export const getDashboardInsights = query({
  args: {
    timeframe: v.optional(v.union(v.literal('7d'), v.literal('30d'), v.literal('90d'))),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const timeframe = args.timeframe || '30d';
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    const startTime = Date.now() - days * 24 * 60 * 60 * 1000;

    // Get user's company
    const company = await ctx.db
      .query('companies')
      .withIndex('by_owner', (q) => q.eq('ownerId', userId))
      .first();

    if (!company) {
      return {
        overview: { totalFeatures: 0, totalSubscribers: 0, totalViews: 0, conversionRate: 0 },
        trends: { signups: [], views: [] },
        features: [],
        traffic: { sources: [], devices: [], topFeatures: [] },
        recent: [],
        insights: [],
      };
    }

    // Get all features
    const features = await ctx.db
      .query('features')
      .withIndex('by_company', (q) => q.eq('companyId', company._id))
      .collect();

    const featureIds = features.map(f => f._id);
    const featureMap = new Map(features.map(f => [f._id, f]));

    // Get all analytics data
    const [allSubscribers, allClicks] = await Promise.all([
      ctx.db.query('subscribers').collect(),
      ctx.db
        .query('clicks')
        .withIndex('by_timestamp', (q) => q.gte('timestamp', startTime))
        .filter((q) => q.or(...featureIds.map(id => q.eq(q.field('featureId'), id))))
        .collect()
    ]);

    const companySubscribers = allSubscribers.filter(s => featureIds.includes(s.featureId));
    const recentSubscribers = companySubscribers.filter(s => s.subscribedAt >= startTime);
    const pageViews = allClicks.filter(c => c.type === 'page_view');

    // Calculate overview metrics
    const totalViews = pageViews.length;
    const totalSubscribers = companySubscribers.length;
    const conversionRate = totalViews > 0 ? (recentSubscribers.length / totalViews) * 100 : 0;

    // Generate daily trends
    const dailySignups: Record<string, number> = {};
    const dailyViews: Record<string, number> = {};
    
    // Initialize buckets
    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().split('T')[0];
      dailySignups[dateKey] = 0;
      dailyViews[dateKey] = 0;
    }

    // Fill buckets
    recentSubscribers.forEach(sub => {
      const dateKey = new Date(sub.subscribedAt).toISOString().split('T')[0];
      if (dailySignups[dateKey] !== undefined) dailySignups[dateKey]++;
    });

    pageViews.forEach(view => {
      const dateKey = new Date(view.timestamp).toISOString().split('T')[0];
      if (dailyViews[dateKey] !== undefined) dailyViews[dateKey]++;
    });

    // Analyze traffic sources and devices
    const referrerCounts: Record<string, number> = {};
    const deviceCounts: Record<string, number> = {};

    allClicks.forEach(click => {
      // Referrers - secure domain parsing
      if (click.referrer) {
        try {
          const url = new URL(click.referrer);
          // Only accept HTTP/HTTPS URLs
          if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            referrerCounts.Direct = (referrerCounts.Direct || 0) + 1;
            return;
          }
          
          // Normalize domain (remove www. prefix)
          const domain = url.hostname.replace(/^www\./, '');
          
          // Validate domain format
          if (domain && /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) {
            referrerCounts[domain] = (referrerCounts[domain] || 0) + 1;
          } else {
            referrerCounts.Direct = (referrerCounts.Direct || 0) + 1;
          }
        } catch {
          referrerCounts.Direct = (referrerCounts.Direct || 0) + 1;
        }
      } else {
        referrerCounts.Direct = (referrerCounts.Direct || 0) + 1;
      }

      // Devices
      if (click.userAgent) {
        const ua = click.userAgent.toLowerCase();
        const device = ua.includes('mobile') || ua.includes('iphone') || ua.includes('android') 
          ? 'Mobile' 
          : ua.includes('tablet') || ua.includes('ipad') 
          ? 'Tablet' 
          : 'Desktop';
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      }
    });

    // Feature performance
    const featurePerformance = await Promise.all(
      features.map(async (feature) => {
        const featureSubscribers = companySubscribers.filter(s => s.featureId === feature._id);
        const featureViews = pageViews.filter(c => c.featureId === feature._id);
        const featureConversion = featureViews.length > 0 ? (featureSubscribers.length / featureViews.length) * 100 : 0;

        return {
          id: feature._id,
          title: feature.title,
          slug: feature.slug,
          status: feature.status,
          subscribers: featureSubscribers.length,
          views: featureViews.length,
          conversionRate: Math.round(featureConversion * 100) / 100,
          trend: 'stable', // Could calculate trend from historical data
        };
      })
    );

    // Recent activity (last 20 events)
    const recentActivity = allClicks
      .slice(-20)
      .reverse()
      .map(click => {
        const feature = featureMap.get(click.featureId);
        let referrer = 'Direct';
        
        if (click.referrer) {
          try {
            const url = new URL(click.referrer);
            // Only accept HTTP/HTTPS URLs
            if (url.protocol === 'http:' || url.protocol === 'https:') {
              const domain = url.hostname.replace(/^www\./, '');
              // Validate domain format
              if (domain && /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) {
                referrer = domain;
              }
            }
          } catch {
            referrer = 'Direct';
          }
        }

        return {
          featureTitle: feature?.title || 'Unknown',
          type: click.type,
          referrer,
          timestamp: click.timestamp,
        };
      });

    // Generate insights
    const insights = [];
    
    // Performance insights
    const bestPerformer = featurePerformance.reduce((best, current) => 
      current.conversionRate > best.conversionRate ? current : best
    );
    
    if (bestPerformer.conversionRate > 10) {
      insights.push({
        type: 'success',
        title: 'High Converting Feature',
        message: `${bestPerformer.title} has a ${bestPerformer.conversionRate}% conversion rate!`,
        action: 'Consider promoting this feature more heavily',
      });
    }

    // Traffic insights
    const topReferrer = Object.entries(referrerCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (topReferrer && topReferrer[0] !== 'Direct' && topReferrer[1] > 5) {
      insights.push({
        type: 'info',
        title: 'Top Traffic Source',
        message: `${topReferrer[0]} is driving ${topReferrer[1]} visits`,
        action: 'Focus marketing efforts on this platform',
      });
    }

    return {
      overview: {
        totalFeatures: features.length,
        totalSubscribers,
        totalViews,
        conversionRate: Math.round(conversionRate * 100) / 100,
      },
      trends: {
        signups: Object.entries(dailySignups)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date)),
        views: Object.entries(dailyViews)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date)),
      },
      features: featurePerformance.sort((a, b) => b.views - a.views),
      traffic: {
        sources: Object.entries(referrerCounts)
          .map(([source, count]) => ({ source, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
        devices: Object.entries(deviceCounts)
          .map(([device, count]) => ({ device, count }))
          .sort((a, b) => b.count - a.count),
        topFeatures: featurePerformance
          .sort((a, b) => b.subscribers - a.subscribers)
          .slice(0, 5),
      },
      recent: recentActivity.slice(0, 10),
      insights,
    };
  },
});

// Helper function to get dashboard insights
async function getDashboardInsightsData(ctx: any, args: { timeframe?: '7d' | '30d' | '90d' }) {
  const userId = await auth.getUserId(ctx);
  if (!userId) throw new Error('Not authenticated');

  const timeframe = args.timeframe || '30d';
  const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
  const startTime = Date.now() - days * 24 * 60 * 60 * 1000;

  // Get user's company
  const company = await ctx.db
    .query('companies')
    .withIndex('by_owner', (q: any) => q.eq('ownerId', userId))
    .first();

  if (!company) {
    return {
      overview: { totalFeatures: 0, totalSubscribers: 0, totalViews: 0, conversionRate: 0 },
      trends: { signups: [], views: [] },
      features: [],
      traffic: { sources: [], devices: [], topFeatures: [] },
      recent: [],
      insights: [],
    };
  }

  // Get all features
  const features = await ctx.db
    .query('features')
    .withIndex('by_company', (q: any) => q.eq('companyId', company._id))
    .collect();

  const featureIds = features.map((f: any) => f._id);
  const featureMap = new Map(features.map((f: any) => [f._id, f]));

  // Get all analytics data
  const [allSubscribers, allClicks] = await Promise.all([
    ctx.db.query('subscribers').collect(),
    ctx.db
      .query('clicks')
      .withIndex('by_timestamp', (q: any) => q.gte('timestamp', startTime))
      .filter((q: any) => q.or(...featureIds.map((id: any) => q.eq(q.field('featureId'), id))))
      .collect()
  ]);

  const companySubscribers = allSubscribers.filter((s: any) => featureIds.includes(s.featureId));
  const recentSubscribers = companySubscribers.filter((s: any) => s.subscribedAt >= startTime);
  const pageViews = allClicks.filter((c: any) => c.type === 'page_view');

  // Calculate overview metrics
  const totalViews = pageViews.length;
  const totalSubscribers = companySubscribers.length;
  const conversionRate = totalViews > 0 ? (recentSubscribers.length / totalViews) * 100 : 0;

  // Generate daily trends
  const dailySignups: Record<string, number> = {};
  const dailyViews: Record<string, number> = {};
  
  // Initialize buckets
  for (let i = 0; i < days; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateKey = date.toISOString().split('T')[0];
    dailySignups[dateKey] = 0;
    dailyViews[dateKey] = 0;
  }

  // Fill buckets
  recentSubscribers.forEach((sub: any) => {
    const dateKey = new Date(sub.subscribedAt).toISOString().split('T')[0];
    if (dailySignups[dateKey] !== undefined) dailySignups[dateKey]++;
  });

  pageViews.forEach((view: any) => {
    const dateKey = new Date(view.timestamp).toISOString().split('T')[0];
    if (dailyViews[dateKey] !== undefined) dailyViews[dateKey]++;
  });

  // Feature performance
  const featurePerformance = await Promise.all(
    features.map(async (feature: any) => {
      const featureSubscribers = companySubscribers.filter((s: any) => s.featureId === feature._id);
      const featureViews = pageViews.filter((c: any) => c.featureId === feature._id);
      const featureConversion = featureViews.length > 0 ? (featureSubscribers.length / featureViews.length) * 100 : 0;

      return {
        id: feature._id,
        title: feature.title,
        slug: feature.slug,
        status: feature.status,
        subscribers: featureSubscribers.length,
        views: featureViews.length,
        conversionRate: Math.round(featureConversion * 100) / 100,
        trend: 'stable',
      };
    })
  );

  return {
    overview: {
      totalFeatures: features.length,
      totalSubscribers,
      totalViews,
      conversionRate: Math.round(conversionRate * 100) / 100,
    },
    trends: {
      signups: Object.entries(dailySignups)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      views: Object.entries(dailyViews)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    },
    features: featurePerformance.sort((a, b) => b.views - a.views),
    traffic: {
      sources: [],
      devices: [],
      topFeatures: featurePerformance
        .sort((a, b) => b.subscribers - a.subscribers)
        .slice(0, 5),
    },
    recent: [],
    insights: [],
  };
}

// Legacy queries for backward compatibility
export const getSignupTrends = query({
  args: {},
  handler: async (ctx) => {
    const insights = await getDashboardInsightsData(ctx, {});
    return insights.trends.signups;
  },
});

export const getTopFeatures = query({
  args: {},
  handler: async (ctx) => {
    const insights = await getDashboardInsightsData(ctx, {});
    return insights.traffic.topFeatures.map(f => ({
      title: f.title,
      slug: f.slug,
      subscriberCount: f.subscribers,
      status: f.status,
    }));
  },
});