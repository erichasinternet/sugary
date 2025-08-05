// Plan limits and features configuration
export const PLAN_LIMITS = {
  free: {
    maxFeatures: 3,
    maxSubscribersPerFeature: 50,
  },
  pro: {
    maxFeatures: Infinity,
    maxSubscribersPerFeature: Infinity,
  }
} as const;

export function getPlanFromSubscriptionStatus(status: string | null): 'free' | 'pro' {
  return status === 'active' || status === 'trialing' ? 'pro' : 'free';
}

export function canCreateFeature(currentFeatureCount: number, plan: 'free' | 'pro'): boolean {
  return currentFeatureCount < PLAN_LIMITS[plan].maxFeatures;
}

export function canAddSubscriber(currentSubscriberCount: number, plan: 'free' | 'pro'): boolean {
  return currentSubscriberCount < PLAN_LIMITS[plan].maxSubscribersPerFeature;
}