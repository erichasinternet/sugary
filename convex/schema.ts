import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const schema = defineSchema({
  ...authTables,

  companies: defineTable({
    name: v.string(),
    slug: v.string(), // URL-friendly company identifier
    ownerId: v.id('users'),
    createdAt: v.number(),
  })
    .index('by_owner', ['ownerId'])
    .index('by_slug', ['slug']),

  features: defineTable({
    title: v.string(),
    slug: v.string(), // URL-friendly feature identifier
    description: v.optional(v.string()),
    companyId: v.id('companies'),
    status: v.union(
      v.literal('todo'),
      v.literal('requested'),
      v.literal('in_progress'),
      v.literal('done'),
      v.literal('cancelled'),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_company', ['companyId'])
    .index('by_company_and_slug', ['companyId', 'slug']),

  subscribers: defineTable({
    email: v.string(),
    featureId: v.id('features'),
    context: v.optional(v.string()), // User's reason for wanting the feature
    confirmed: v.boolean(),
    confirmationToken: v.optional(v.string()),
    subscribedAt: v.number(),
  })
    .index('by_feature', ['featureId'])
    .index('by_email_and_feature', ['email', 'featureId'])
    .index('by_confirmation_token', ['confirmationToken']),

  updates: defineTable({
    featureId: v.id('features'),
    title: v.string(),
    content: v.string(),
    sentAt: v.number(),
    recipientCount: v.number(),
  }).index('by_feature', ['featureId']),

  chatMessages: defineTable({
    featureId: v.id('features'),
    authorName: v.string(),
    authorEmail: v.optional(v.string()),
    message: v.string(),
    isFounder: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index('by_feature', ['featureId'])
    .index('by_feature_and_time', ['featureId', 'createdAt']),

  subscriptions: defineTable({
    userId: v.id('users'),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    subscriptionStatus: v.union(
      v.literal('trialing'),
      v.literal('active'),
      v.literal('canceled'),
      v.literal('incomplete'),
      v.literal('incomplete_expired'),
      v.literal('past_due'),
      v.literal('unpaid')
    ),
    trialEndsAt: v.optional(v.number()),
    trialStartedAt: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    paymentMethodRequired: v.optional(v.boolean()),
    trialRemindersSent: v.optional(v.array(v.string())), // Array of reminder types sent
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_stripe_customer', ['stripeCustomerId'])
    .index('by_stripe_subscription', ['stripeSubscriptionId'])
    .index('by_trial_end', ['trialEndsAt']),
});

export default schema;
