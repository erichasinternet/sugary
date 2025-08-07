// Plan limits and features configuration
export const PLAN_LIMITS = {
  free: {
    maxFeatures: 3,
    maxSubscribersPerFeature: 50,
    maxTotalSubscribers: 50,
    maxSubscriberUpdatesPerMonth: 5,
  },
  pro: {
    maxFeatures: Infinity,
    maxSubscribersPerFeature: Infinity,
    maxTotalSubscribers: Infinity,
    maxSubscriberUpdatesPerMonth: Infinity,
  }
} as const;

export function getPlanFromSubscriptionStatus(status: string | null): 'free' | 'pro' {
  // Users are considered 'pro' during trial and active subscription
  return status === 'active' || status === 'trialing' ? 'pro' : 'free';
}

export function getTrialDaysRemaining(trialEndsAt: number | null): number {
  if (!trialEndsAt) return 0;
  const now = Date.now();
  const daysRemaining = Math.ceil((trialEndsAt - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysRemaining);
}

export function isTrialExpiring(trialEndsAt: number | null, daysThreshold: number = 3): boolean {
  if (!trialEndsAt) return false;
  const daysRemaining = getTrialDaysRemaining(trialEndsAt);
  return daysRemaining <= daysThreshold && daysRemaining > 0;
}

export function canCreateFeature(currentFeatureCount: number, plan: 'free' | 'pro'): boolean {
  return currentFeatureCount < PLAN_LIMITS[plan].maxFeatures;
}

export function canAddSubscriber(currentSubscriberCount: number, plan: 'free' | 'pro'): boolean {
  return currentSubscriberCount < PLAN_LIMITS[plan].maxSubscribersPerFeature;
}

export function canSendSubscriberUpdate(currentSubscriberUpdatesThisMonth: number, plan: 'free' | 'pro'): boolean {
  return currentSubscriberUpdatesThisMonth < PLAN_LIMITS[plan].maxSubscriberUpdatesPerMonth;
}

export function canAddTotalSubscriber(currentTotalSubscribers: number, plan: 'free' | 'pro'): boolean {
  return currentTotalSubscribers < PLAN_LIMITS[plan].maxTotalSubscribers;
}