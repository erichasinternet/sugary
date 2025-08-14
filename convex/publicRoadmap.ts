import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Get public roadmap for a company (only public columns)
export const getPublicRoadmap = query({
  args: {
    companySlug: v.string(),
  },
  handler: async (ctx, { companySlug }) => {
    // Get company by slug
    const company = await ctx.db
      .query('companies')
      .withIndex('by_slug', (q) => q.eq('slug', companySlug))
      .first();

    if (!company) return null;

    // Get features with public statuses only
    const features = await ctx.db
      .query('features')
      .withIndex('by_company', (q) => q.eq('companyId', company._id))
      .filter((q) => 
        q.or(
          q.eq(q.field('status'), 'requested'),
          q.eq(q.field('status'), 'in_progress'), 
          q.eq(q.field('status'), 'done')
        )
      )
      .collect();

    // Add upvote counts, subscriber counts, and recent updates to each feature
    const featuresWithCounts = await Promise.all(
      features.map(async (feature) => {
        const [upvoteCount, subscriberCount, recentUpdate] = await Promise.all([
          ctx.db
            .query('upvotes')
            .withIndex('by_feature', (q) => q.eq('featureId', feature._id))
            .collect()
            .then((votes) => votes.length),
          ctx.db
            .query('subscribers')
            .withIndex('by_feature', (q) => q.eq('featureId', feature._id))
            .collect()
            .then((subs) => subs.length),
          ctx.db
            .query('updates')
            .withIndex('by_feature', (q) => q.eq('featureId', feature._id))
            .order('desc')
            .first()
        ]);

        return {
          ...feature,
          upvoteCount,
          subscriberCount,
          recentUpdate,
        };
      })
    );

    return {
      company,
      features: featuresWithCounts,
    };
  },
});

// Check if user has already voted for a feature
export const checkUserVote = query({
  args: {
    featureId: v.id('features'),
    sessionId: v.string(),
    email: v.optional(v.string()),
  },
  handler: async (ctx, { featureId, sessionId, email }) => {
    // Check by session ID first (most reliable)
    const sessionVote = await ctx.db
      .query('upvotes')
      .withIndex('by_session_and_feature', (q) => 
        q.eq('sessionId', sessionId).eq('featureId', featureId)
      )
      .first();

    if (sessionVote) return { hasVoted: true, voteId: sessionVote._id };

    // Check by email if provided
    if (email) {
      const emailVote = await ctx.db
        .query('upvotes')
        .withIndex('by_email_and_feature', (q) => 
          q.eq('voterEmail', email).eq('featureId', featureId)
        )
        .first();

      if (emailVote) return { hasVoted: true, voteId: emailVote._id };
    }

    return { hasVoted: false };
  },
});

// Upvote a feature
export const upvoteFeature = mutation({
  args: {
    featureId: v.id('features'),
    sessionId: v.string(),
    voterEmail: v.optional(v.string()),
    voterIp: v.optional(v.string()),
    notifyOnShip: v.optional(v.boolean()),
  },
  handler: async (ctx, { featureId, sessionId, voterEmail, voterIp, notifyOnShip }) => {
    // Check if already voted
    const existingVote = await ctx.db
      .query('upvotes')
      .withIndex('by_session_and_feature', (q) => 
        q.eq('sessionId', sessionId).eq('featureId', featureId)
      )
      .first();

    if (existingVote) {
      throw new Error('You have already voted for this feature');
    }

    // Check by email if provided
    if (voterEmail) {
      const emailVote = await ctx.db
        .query('upvotes')
        .withIndex('by_email_and_feature', (q) => 
          q.eq('voterEmail', voterEmail).eq('featureId', featureId)
        )
        .first();

      if (emailVote) {
        throw new Error('You have already voted for this feature');
      }
    }

    // Create the upvote
    const voteId = await ctx.db.insert('upvotes', {
      featureId,
      sessionId,
      voterEmail,
      voterIp,
      notifyOnShip: notifyOnShip || false,
      createdAt: Date.now(),
    });

    return { success: true, voteId };
  },
});

// Remove upvote (for undo functionality)
export const removeUpvote = mutation({
  args: {
    featureId: v.id('features'),
    sessionId: v.string(),
  },
  handler: async (ctx, { featureId, sessionId }) => {
    const vote = await ctx.db
      .query('upvotes')
      .withIndex('by_session_and_feature', (q) => 
        q.eq('sessionId', sessionId).eq('featureId', featureId)
      )
      .first();

    if (!vote) {
      throw new Error('No vote found to remove');
    }

    await ctx.db.delete(vote._id);
    return { success: true };
  },
});

// Get upvote count for a specific feature
export const getUpvoteCount = query({
  args: {
    featureId: v.id('features'),
  },
  handler: async (ctx, { featureId }) => {
    const votes = await ctx.db
      .query('upvotes')
      .withIndex('by_feature', (q) => q.eq('featureId', featureId))
      .collect();

    return votes.length;
  },
});