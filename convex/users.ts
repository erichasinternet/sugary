import { v } from 'convex/values';
import { mutation, query, action } from './_generated/server';
import { auth } from './auth';
import { internal } from './_generated/api';

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    return await ctx.db.get(userId);
  },
});

export const createUserProfile = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const user = await ctx.db.get(userId);
    if (!user) throw new Error('User not found');

    // Update the user profile
    await ctx.db.patch(userId, { name });

    return userId;
  },
});

// Action to handle post-signup operations including trial creation
export const handlePostSignup = action({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    try {
      // Automatically create trial subscription for new user
      await ctx.runAction(internal.stripe.autoCreateTrialSubscription, { userId });
    } catch (error) {
      console.error("Failed to create trial during signup:", error);
      // Don't block signup if trial creation fails
    }
  },
});
