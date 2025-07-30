import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const subscribe = mutation({
  args: {
    featureId: v.id("features"),
    email: v.string(),
    context: v.optional(v.string()),
  },
  handler: async (ctx, { featureId, email, context }) => {
    // Check if already subscribed
    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email_and_feature", (q) => 
        q.eq("email", email).eq("featureId", featureId)
      )
      .first();
      
    if (existing) {
      throw new Error("Email is already subscribed to this feature");
    }
    
    // Generate confirmation token
    const confirmationToken = crypto.randomUUID();
    
    const subscriberId = await ctx.db.insert("subscribers", {
      email,
      featureId,
      context,
      confirmed: false,
      confirmationToken,
      subscribedAt: Date.now(),
    });
    
    // Get feature and company info for the email
    const feature = await ctx.db.get(featureId);
    if (feature) {
      const company = await ctx.db.get(feature.companyId);
      if (company) {
        // Schedule confirmation email
        await ctx.scheduler.runAfter(0, internal.emails.sendConfirmationEmail, {
          email,
          featureTitle: feature.title,
          companyName: company.name,
          confirmationToken,
        });
      }
    }
    
    return subscriberId;
  },
});

export const confirmSubscription = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, { token }) => {
    const subscriber = await ctx.db
      .query("subscribers")
      .withIndex("by_confirmation_token", (q) => q.eq("confirmationToken", token))
      .first();
      
    if (!subscriber) {
      throw new Error("Invalid confirmation token");
    }
    
    await ctx.db.patch(subscriber._id, {
      confirmed: true,
      confirmationToken: undefined,
    });
    
    return subscriber;
  },
});

export const getSubscribersByFeature = query({
  args: { featureId: v.id("features") },
  handler: async (ctx, { featureId }) => {
    return await ctx.db
      .query("subscribers")
      .withIndex("by_feature", (q) => q.eq("featureId", featureId))
      .collect();
  },
});