import { query, mutation } from "./_generated/server";
import { auth } from "./auth";
import { v } from "convex/values";

export const getMyCompany = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    
    return await ctx.db
      .query("companies")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .first();
  },
});

export const createCompany = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, { name, slug }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    // Check if slug is already taken
    const existing = await ctx.db
      .query("companies")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
      
    if (existing) {
      throw new Error("Company slug is already taken");
    }
    
    // Check if user already has a company
    const userCompany = await ctx.db
      .query("companies")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .first();
      
    if (userCompany) {
      throw new Error("User already has a company");
    }
    
    return await ctx.db.insert("companies", {
      name,
      slug,
      ownerId: userId,
      createdAt: Date.now(),
    });
  },
});

export const getCompanyBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("companies")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});