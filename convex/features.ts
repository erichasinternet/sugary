import { v } from 'convex/values';
import { internal } from './_generated/api';
import { mutation, query } from './_generated/server';
import { auth } from './auth';

export const getMyFeatures = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    // Get user's company
    const company = await ctx.db
      .query('companies')
      .withIndex('by_owner', (q) => q.eq('ownerId', userId))
      .first();

    if (!company) return [];

    // Get all features for the company with subscriber counts
    const features = await ctx.db
      .query('features')
      .withIndex('by_company', (q) => q.eq('companyId', company._id))
      .collect();

    // Add subscriber count to each feature
    const featuresWithCounts = await Promise.all(
      features.map(async (feature) => {
        const subscriberCount = await ctx.db
          .query('subscribers')
          .withIndex('by_feature', (q) => q.eq('featureId', feature._id))
          .collect()
          .then((subs) => subs.length);

        return {
          ...feature,
          subscriberCount,
        };
      }),
    );

    return featuresWithCounts;
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
    if (!userId) throw new Error('Not authenticated');

    // Get user's company
    const company = await ctx.db
      .query('companies')
      .withIndex('by_owner', (q) => q.eq('ownerId', userId))
      .first();

    if (!company) {
      throw new Error('No company found. Please create a company first.');
    }

    // Check if feature slug already exists for this company
    const existing = await ctx.db
      .query('features')
      .withIndex('by_company_and_slug', (q) => q.eq('companyId', company._id).eq('slug', slug))
      .first();

    if (existing) {
      throw new Error('Feature slug already exists for this company');
    }

    const now = Date.now();
    return await ctx.db.insert('features', {
      title,
      slug,
      description,
      companyId: company._id,
      status: 'planning',
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
    if (!userId) throw new Error('Not authenticated');

    const feature = await ctx.db.get(featureId);
    if (!feature) return null;

    // Verify user owns this feature's company
    const company = await ctx.db.get(feature.companyId);
    if (!company || company.ownerId !== userId) {
      throw new Error('Not authorized to view this feature');
    }

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

export const sendFeatureUpdate = mutation({
  args: {
    featureId: v.id('features'),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { featureId, title, content }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const feature = await ctx.db.get(featureId);
    if (!feature) throw new Error('Feature not found');

    // Verify user owns this feature's company
    const company = await ctx.db.get(feature.companyId);
    if (!company || company.ownerId !== userId) {
      throw new Error('Not authorized to update this feature');
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
