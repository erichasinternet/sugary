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
      v.literal('planning'),
      v.literal('in_progress'),
      v.literal('completed'),
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
});

export default schema;
