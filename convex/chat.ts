import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { auth } from './auth';

export const getFeatureMessages = query({
  args: { featureId: v.id('features') },
  handler: async (ctx, { featureId }) => {
    const messages = await ctx.db
      .query('chatMessages')
      .withIndex('by_feature_and_time', (q) => q.eq('featureId', featureId))
      .order('asc')
      .collect();

    return messages;
  },
});

export const sendMessage = mutation({
  args: {
    featureId: v.id('features'),
    authorName: v.string(),
    authorEmail: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, { featureId, authorName, authorEmail, message }) => {
    // Check if user is authenticated and is the founder
    let isFounder = false;
    const userId = await auth.getUserId(ctx);
    
    if (userId) {
      // Get the feature to check if user owns the company
      const feature = await ctx.db.get(featureId);
      if (feature) {
        const company = await ctx.db.get(feature.companyId);
        if (company && company.ownerId === userId) {
          isFounder = true;
        }
      }
    }

    // Basic content moderation
    const cleanMessage = message.trim();
    if (cleanMessage.length === 0) {
      throw new Error('Message cannot be empty');
    }
    if (cleanMessage.length > 1000) {
      throw new Error('Message too long (max 1000 characters)');
    }

    // Clean author name
    const cleanAuthorName = authorName.trim();
    if (cleanAuthorName.length === 0) {
      throw new Error('Name cannot be empty');
    }
    if (cleanAuthorName.length > 50) {
      throw new Error('Name too long (max 50 characters)');
    }

    const messageId = await ctx.db.insert('chatMessages', {
      featureId,
      authorName: cleanAuthorName,
      authorEmail,
      message: cleanMessage,
      isFounder,
      createdAt: Date.now(),
    });

    return messageId;
  },
});

export const getRecentMessageCount = query({
  args: { featureId: v.id('features') },
  handler: async (ctx, { featureId }) => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    
    const recentMessages = await ctx.db
      .query('chatMessages')
      .withIndex('by_feature_and_time', (q) => 
        q.eq('featureId', featureId).gte('createdAt', oneDayAgo)
      )
      .collect();

    return recentMessages.length;
  },
});