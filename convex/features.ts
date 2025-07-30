import { query, mutation } from "./_generated/server";
import { auth } from "./auth";
import { v } from "convex/values";

export const getMyFeatures = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
    
    // Get user's company
    const company = await ctx.db
      .query("companies")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .first();
      
    if (!company) return [];
    
    // Get all features for the company with subscriber counts
    const features = await ctx.db
      .query("features")
      .withIndex("by_company", (q) => q.eq("companyId", company._id))
      .collect();
      
    // Add subscriber count to each feature
    const featuresWithCounts = await Promise.all(
      features.map(async (feature) => {
        const subscriberCount = await ctx.db
          .query("subscribers")
          .withIndex("by_feature", (q) => q.eq("featureId", feature._id))
          .collect()
          .then(subs => subs.length);
          
        return {
          ...feature,
          subscriberCount,
        };
      })
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
    if (!userId) throw new Error("Not authenticated");
    
    // Get user's company
    const company = await ctx.db
      .query("companies")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .first();
      
    if (!company) {
      throw new Error("No company found. Please create a company first.");
    }
    
    // Check if feature slug already exists for this company
    const existing = await ctx.db
      .query("features")
      .withIndex("by_company_and_slug", (q) => 
        q.eq("companyId", company._id).eq("slug", slug)
      )
      .first();
      
    if (existing) {
      throw new Error("Feature slug already exists for this company");
    }
    
    const now = Date.now();
    return await ctx.db.insert("features", {
      title,
      slug,
      description,
      companyId: company._id,
      status: "planning",
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
      .query("companies")
      .withIndex("by_slug", (q) => q.eq("slug", companySlug))
      .first();
      
    if (!company) return null;
    
    // Get feature by company and slug
    const feature = await ctx.db
      .query("features")
      .withIndex("by_company_and_slug", (q) => 
        q.eq("companyId", company._id).eq("slug", featureSlug)
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
  args: { featureId: v.id("features") },
  handler: async (ctx, { featureId }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const feature = await ctx.db.get(featureId);
    if (!feature) return null;
    
    // Verify user owns this feature's company
    const company = await ctx.db.get(feature.companyId);
    if (!company || company.ownerId !== userId) {
      throw new Error("Not authorized to view this feature");
    }
    
    // Get subscribers
    const subscribers = await ctx.db
      .query("subscribers")
      .withIndex("by_feature", (q) => q.eq("featureId", featureId))
      .collect();
      
    return {
      ...feature,
      company,
      subscribers,
    };
  },
});