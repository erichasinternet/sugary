'use client';

import { useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import GradientButton from '../../components/GradientButton';

export default function SubscriptionPage() {
  const subscriptionStatus = useQuery(api.stripe.getSubscriptionStatus);
  const createCheckoutSession = useAction(api.stripe.createCheckoutSession);
  const createBillingPortalSession = useAction(api.stripe.createBillingPortalSession);

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
          <h1 className="text-3xl font-bold text-foreground">Subscription</h1>
          <p className="mt-2 text-muted">Manage your Sugary subscription</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Current Plan</h2>
            
            {subscriptionStatus.subscriptionStatus === 'trialing' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                      🎉 Free Trial Active
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">
                      {subscriptionStatus.trialEndsAt && 
                        `Your trial ends on ${formatDate(subscriptionStatus.trialEndsAt)}`
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                      $0.00
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      14-day trial
                    </div>
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
                        `Next billing: ${formatDate(subscriptionStatus.currentPeriodEnd)}`
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-800 dark:text-green-300">
                      $9.00
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      per month
                    </div>
                  </div>
                </div>
              </div>
            )}

            {subscriptionStatus.subscriptionStatus === 'none' && (
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-300">
                      Free Plan
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Limited features available
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-300">
                      $0.00
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      forever
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {!subscriptionStatus.hasActiveSubscription && (
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
                <div className="text-center">
                  <p className="text-sm text-muted">
                    Thank you for supporting Sugary! 🎉
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}