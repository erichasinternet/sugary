'use client';

import { useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import GradientButton from '../../components/GradientButton';
import { PLAN_LIMITS } from '@/lib/plans';
import { IconCheck, IconX, IconMail, IconUsers, IconBolt, IconChartBar } from '@tabler/icons-react';

export default function BillingPage() {
  const subscriptionStatus = useQuery(api.stripe.getSubscriptionStatus);
  const usageStats = useQuery(api.features.getUsageStats);
  const createCheckoutSession = useAction(api.stripe.createCheckoutSession);
  const createBillingPortalSession = useAction(api.stripe.createBillingPortalSession);
  const createTrialSubscription = useAction(api.stripe.createTrialSubscription);

  const handleUpgrade = async () => {
    try {
      const { url } = await createCheckoutSession({
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
        mode: 'subscription',
      });
      window.location.href = url;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
    }
  };

  const handleManageBilling = async () => {
    try {
      const { url } = await createBillingPortalSession();
      window.location.href = url;
    } catch (error) {
      console.error('Failed to create billing portal session:', error);
    }
  };

  const handleStartTrial = async () => {
    try {
      await createTrialSubscription();
      // The page will automatically update when the subscription status changes
    } catch (error) {
      console.error('Failed to start trial:', error);
      alert('Failed to start trial. Please try again.');
    }
  };

  if (!subscriptionStatus) {
    return (
      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card rounded-2xl p-8">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Billing & Usage</h1>
          <p className="mt-2 text-muted">Manage your subscription and track your usage</p>
        </div>

        {/* Usage Overview */}
        {usageStats && (
          <div className="glass-card rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Usage Overview</h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Features Created</span>
                  <span className="font-bold">
                    {usageStats.features.used} /{' '}
                    {usageStats.features.limit === Infinity ? '∞' : usageStats.features.limit}
                  </span>
                </div>
                {usageStats.features.limit !== Infinity && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((usageStats.features.used / usageStats.features.limit) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Total Subscribers</span>
                  <span className="font-bold">
                    {usageStats.totalSubscribers.used} /{' '}
                    {usageStats.totalSubscribers.limit === Infinity
                      ? '∞'
                      : usageStats.totalSubscribers.limit}
                  </span>
                </div>
                {usageStats.totalSubscribers.limit !== Infinity && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((usageStats.totalSubscribers.used / usageStats.totalSubscribers.limit) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Subscriber Updates This Month</span>
                  <span className="font-bold">
                    {usageStats.subscriberUpdates.usedThisMonth} /{' '}
                    {usageStats.subscriberUpdates.limit === Infinity
                      ? '∞'
                      : usageStats.subscriberUpdates.limit}
                  </span>
                </div>
                {usageStats.subscriberUpdates.limit !== Infinity && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((usageStats.subscriberUpdates.usedThisMonth / usageStats.subscriberUpdates.limit) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Plan Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Free Plan */}
          <div className="glass-card rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-foreground mb-2">Free Plan</h3>
              <div className="text-3xl font-bold text-foreground mb-1">$0</div>
              <div className="text-sm text-muted">Forever free</div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <IconCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">Up to {PLAN_LIMITS.free.maxFeatures} features</span>
              </div>
              <div className="flex items-center gap-3">
                <IconCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">
                  Up to {PLAN_LIMITS.free.maxSubscribersPerFeature} subscribers per feature
                </span>
              </div>
              <div className="flex items-center gap-3">
                <IconCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">
                  Up to {PLAN_LIMITS.free.maxSubscriberUpdatesPerMonth} subscriber updates per month
                </span>
              </div>
              <div className="flex items-center gap-3">
                <IconCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">Unlimited live chat</span>
              </div>
              <div className="flex items-center gap-3">
                <IconX className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-muted">Priority support</span>
              </div>
            </div>

            {subscriptionStatus?.subscriptionStatus === 'none' && (
              <div className="text-center mt-4">
                <div className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium inline-block">
                  Current Plan
                </div>
              </div>
            )}
          </div>

          {/* Pro Plan */}
          <div className="glass-card rounded-2xl p-6 border-2 border-gradient-to-r from-purple-500 to-pink-500 relative overflow-hidden">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-pink-300 mb-2">Sugary Pro</h3>
              <div className="text-3xl font-bold text-foreground mb-1">$9</div>
              <div className="text-sm text-muted">per month</div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <IconCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium">Unlimited features</span>
              </div>
              <div className="flex items-center gap-3">
                <IconCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium">Unlimited subscribers</span>
              </div>
              <div className="flex items-center gap-3">
                <IconCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium">Unlimited subscriber updates</span>
              </div>
              <div className="flex items-center gap-3">
                <IconCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium">Unlimited live chat</span>
              </div>
              <div className="flex items-center gap-3">
                <IconMail className="h-4 w-4 text-purple-500 flex-shrink-0" />
                <span className="text-sm font-medium">Priority support</span>
              </div>
            </div>

            {(subscriptionStatus?.subscriptionStatus === 'active' ||
              subscriptionStatus?.subscriptionStatus === 'trialing') && (
              <div className="text-center mt-4">
                <div className="px-3 py-1 bg-pink-100  text-black rounded-full text-sm font-medium inline-block">
                  Current Plan
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Current Status</h2>

            {subscriptionStatus.subscriptionStatus === 'trialing' && (
              <div className="bg-pink/10 border border-pink-200 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-pink-300">Free Trial Active</h3>
                    <p className="text-grey text-sm">
                      {subscriptionStatus.trialEndsAt &&
                        `Your trial ends on ${formatDate(subscriptionStatus.trialEndsAt)}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-grey">$0.00</div>
                    <div className="text-xs text-grey">14-day trial</div>
                  </div>
                </div>
              </div>
            )}

            {subscriptionStatus.subscriptionStatus === 'active' && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-300">
                      ✅ Pro Plan
                    </h3>
                    <p className="text-green-600 dark:text-green-400 text-sm">
                      {subscriptionStatus.currentPeriodEnd &&
                        `Next billing: ${formatDate(subscriptionStatus.currentPeriodEnd)}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-800 dark:text-green-300">
                      $9.00
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">per month</div>
                  </div>
                </div>
              </div>
            )}

            {subscriptionStatus.subscriptionStatus === 'none' && (
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-300">Free Plan</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Limited features available
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-300">$0.00</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">forever</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {subscriptionStatus.subscriptionStatus === 'none' && subscriptionStatus.isNewUser && (
              <div className="space-y-3">
                <GradientButton onClick={handleStartTrial} className="w-full" size="lg">
                  🎉 Start 14-Day Free Trial
                </GradientButton>
                <div className="text-center">
                  <p className="text-xs text-muted">
                    No payment required • Cancel anytime during trial
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">or</span>
                  </div>
                </div>
                <GradientButton
                  onClick={handleUpgrade}
                  className="w-full"
                  size="lg"
                  variant="outline"
                >
                  Upgrade to Pro - $9/month
                </GradientButton>
              </div>
            )}

            {subscriptionStatus.subscriptionStatus === 'none' && !subscriptionStatus.isNewUser && (
              <div className="space-y-3">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted">Ready to get back to unlimited features?</p>
                </div>
                <GradientButton onClick={handleUpgrade} className="w-full" size="lg">
                  Upgrade to Pro - $9/month
                </GradientButton>
                <div className="text-center">
                  <p className="text-xs text-muted">Cancel anytime • 30-day money-back guarantee</p>
                </div>
              </div>
            )}

            {!subscriptionStatus.hasActiveSubscription &&
              subscriptionStatus.subscriptionStatus !== 'none' && (
                <GradientButton onClick={handleUpgrade} className="w-full" size="lg">
                  Upgrade to Pro - $9/month
                </GradientButton>
              )}

            {subscriptionStatus.subscriptionStatus === 'trialing' && (
              <div className="text-center">
                <p className="text-sm text-muted mb-4">
                  {subscriptionStatus.trialEndsAt &&
                  new Date(subscriptionStatus.trialEndsAt).getTime() - Date.now() <
                    3 * 24 * 60 * 60 * 1000
                    ? 'Your trial ends soon! Upgrade now to keep growing your business with Sugary Pro.'
                    : 'Enjoying your trial? Upgrade now to keep growing your business with Sugary Pro.'}
                </p>
                <GradientButton onClick={handleUpgrade} className="w-full" size="lg">
                  Upgrade to Pro - $9/month
                </GradientButton>
              </div>
            )}

            {subscriptionStatus.hasActiveSubscription && (
              <div className="space-y-4">
                <GradientButton onClick={handleManageBilling} className="w-full" size="lg">
                  Manage Billing & Subscription
                </GradientButton>
                <div className="text-center"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
