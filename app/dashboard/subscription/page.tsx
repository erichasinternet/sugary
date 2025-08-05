'use client';

import { useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import GradientButton from '../../components/GradientButton';
import { getPlanFromSubscriptionStatus, PLAN_LIMITS } from '@/lib/plans';
import {
  IconCheck,
  IconX,
  IconStar,
  IconTrendingUp,
  IconMail,
  IconDownload,
} from '@tabler/icons-react';

export default function SubscriptionPage() {
  const subscriptionStatus = useQuery(api.stripe.getSubscriptionStatus);
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
          <h1 className="text-3xl font-bold text-foreground">Choose Your Plan</h1>
          <p className="mt-2 text-muted">Start free, upgrade when you're ready to scale</p>
        </div>

        {/* Plan Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Free Plan */}
          <div className="glass-card rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-foreground mb-2">Free Plan</h3>
              <div className="text-3xl font-bold text-foreground mb-1">$0</div>
              <div className="text-sm text-muted">Forever free</div>
              {subscriptionStatus?.subscriptionStatus === 'none' && (
                <div className="mt-3 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                  Current Plan
                </div>
              )}
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
                <span className="text-sm">Unlimited updates & messaging</span>
              </div>
              <div className="flex items-center gap-3">
                <IconX className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-muted">Priority support</span>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="glass-card rounded-2xl p-6 border-2 border-gradient-to-r from-purple-500 to-pink-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-bold">
              POPULAR
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-foreground mb-2">Pro Plan</h3>
              <div className="text-3xl font-bold text-foreground mb-1">$9</div>
              <div className="text-sm text-muted">per month</div>
              {(subscriptionStatus?.subscriptionStatus === 'active' ||
                subscriptionStatus?.subscriptionStatus === 'trialing') && (
                <div className="mt-3 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                  Current Plan
                </div>
              )}
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
                <span className="text-sm font-medium">Unlimited updates & messaging</span>
              </div>
              <div className="flex items-center gap-3">
                <IconMail className="h-4 w-4 text-purple-500 flex-shrink-0" />
                <span className="text-sm font-medium">Priority support</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Current Status</h2>

            {subscriptionStatus.subscriptionStatus === 'trialing' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                      🎉 Free Trial Active
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">
                      {subscriptionStatus.trialEndsAt &&
                        `Your trial ends on ${formatDate(subscriptionStatus.trialEndsAt)}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">$0.00</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">14-day trial</div>
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
            {subscriptionStatus.subscriptionStatus === 'none' && (
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

            {!subscriptionStatus.hasActiveSubscription &&
              subscriptionStatus.subscriptionStatus !== 'none' && (
                <GradientButton onClick={handleUpgrade} className="w-full" size="lg">
                  Upgrade to Pro - $9/month
                </GradientButton>
              )}

            {subscriptionStatus.subscriptionStatus === 'trialing' && (
              <div className="text-center">
                <p className="text-sm text-muted mb-4">
                  Upgrade now to ensure uninterrupted service when your trial ends
                </p>
                <GradientButton onClick={handleUpgrade} className="w-full" size="lg">
                  Upgrade to Pro Now - $9/month
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
