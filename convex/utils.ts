import { QueryCtx, MutationCtx, ActionCtx } from './_generated/server';
import { Id } from './_generated/dataModel';
import { getPlanFromSubscriptionStatus } from '../lib/plans';

type DatabaseCtx = QueryCtx | MutationCtx | ActionCtx;

/**
 * Get the user's company by their user ID
 */
export async function getUserCompany(ctx: DatabaseCtx, userId: Id<'users'>) {
  return await ctx.db
    .query('companies')
    .withIndex('by_owner', (q) => q.eq('ownerId', userId))
    .first();
}

/**
 * Get the user's subscription record
 */
export async function getUserSubscription(ctx: DatabaseCtx, userId: Id<'users'>) {
  return await ctx.db
    .query('subscriptions')
    .withIndex('by_user', (q) => q.eq('userId', userId))
    .unique();
}

/**
 * Get the user's current plan (free or pro) based on subscription status
 */
export async function getUserPlan(ctx: DatabaseCtx, userId: Id<'users'>): Promise<'free' | 'pro'> {
  const subscription = await getUserSubscription(ctx, userId);
  return getPlanFromSubscriptionStatus(subscription?.subscriptionStatus || null);
}

/**
 * Check if a user owns a specific feature by checking company ownership
 */
export async function checkFeatureOwnership(ctx: DatabaseCtx, userId: Id<'users'>, featureId: Id<'features'>) {
  const feature = await ctx.db.get(featureId);
  if (!feature) return false;

  const company = await ctx.db.get(feature.companyId);
  if (!company) return false;

  return company.ownerId === userId;
}

/**
 * Get a feature with company information, ensuring user owns it
 */
export async function getOwnedFeature(ctx: DatabaseCtx, userId: Id<'users'>, featureId: Id<'features'>) {
  const feature = await ctx.db.get(featureId);
  if (!feature) return null;

  const company = await ctx.db.get(feature.companyId);
  if (!company || company.ownerId !== userId) return null;

  return { feature, company };
}

/**
 * Require authentication and return user ID, throwing if not authenticated
 */
export function requireAuth(userId: Id<'users'> | null): Id<'users'> {
  if (!userId) throw new Error('Not authenticated');
  return userId;
}

/**
 * Get user's company and throw if not found or user not authenticated
 */
export async function requireUserCompany(ctx: DatabaseCtx, userId: Id<'users'> | null) {
  const authenticatedUserId = requireAuth(userId);
  const company = await getUserCompany(ctx, authenticatedUserId);
  if (!company) throw new Error('No company found. Please create a company first.');
  return company;
}