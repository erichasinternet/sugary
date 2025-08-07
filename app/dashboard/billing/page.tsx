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

  const handleUpgrade = async (priceId: string) => {
    try {
      const { url } = await createCheckoutSession({
        priceId,
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
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-pink-300 h-2 rounded-full transition-all"
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
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-pink-300 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((usageStats.totalSubscribers.used / usageStats.totalSubscribers.limit) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Email Campaigns This Month</span>
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
                      className="bg-pink-300 h-2 rounded-full transition-all"
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
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8 items-stretch">
          {/* Free Plan */}
          {/* <div className="glass-card rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
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
                  Up to {PLAN_LIMITS.free.maxTotalSubscribers} total subscribers
                </span>
              </div>
              <div className="flex items-center gap-3">
                <IconCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">
                  Up to {PLAN_LIMITS.free.maxSubscriberUpdatesPerMonth} email campaigns per month
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
          </div> */}

          {/* Pro Monthly Plan */}
          <div className="glass-card rounded-2xl p-6 border-2 relative overflow-hidden flex flex-col h-full">
            <div className="text-center mb-6 h-24 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-pink-300/70 dark:text-pink-300/70 mb-2">
                Pro Monthly
              </h3>
              <div className="text-3xl font-bold text-foreground mb-1">$20</div>
              <div className="text-sm text-muted">per month</div>
              <div className="text-xs text-muted mt-1 invisible">placeholder</div>
            </div>

            <div className="space-y-3 mb-6 flex-grow">
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
                <span className="text-sm font-medium">Unlimited email campaigns</span>
              </div>
              <div className="flex items-center gap-3">
                <IconCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium">Unlimited live chat</span>
              </div>
              <div className="flex items-center gap-3">
                <IconMail className="h-4 w-4 text-pink-300 flex-shrink-0" />
                <span className="text-sm font-medium">Priority support</span>
              </div>
            </div>

            <div className="mt-auto">
              {(subscriptionStatus?.subscriptionStatus === 'none' ||
                subscriptionStatus?.subscriptionStatus === 'canceled' ||
                subscriptionStatus?.subscriptionStatus === 'trialing') && (
                <GradientButton
                  onClick={() => handleUpgrade(process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!)}
                  className="w-full"
                >
                  {subscriptionStatus?.subscriptionStatus === 'canceled'
                    ? 'Resume Pro'
                    : subscriptionStatus?.subscriptionStatus === 'trialing'
                      ? 'Continue Pro'
                      : 'Go Pro Monthly'}
                </GradientButton>
              )}
            </div>
          </div>

          {/* Pro Annual Plan */}
          <div className="glass-card rounded-2xl p-6 border-2 border-gradient-to-r from-pink-300 to-pink-400 relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-3 right-3">
              <span className="bg-gradient-to-r from-pink-400/90 to-pink-500/90 text-white text-xs px-2 py-1 rounded-full font-medium">
                Save 25%
              </span>
            </div>
            <div className="text-center mb-6 h-24 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-pink-300 mb-2">Pro Annual</h3>
              <div className="text-3xl font-bold text-foreground mb-1">$15</div>
              <div className="text-sm text-muted">per month</div>
              <div className="text-xs text-muted mt-1">billed annually ($180/year)</div>
            </div>

            <div className="space-y-3 mb-6 flex-grow">
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
                <span className="text-sm font-medium">Unlimited email campaigns</span>
              </div>
              <div className="flex items-center gap-3">
                <IconCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium">Unlimited live chat</span>
              </div>
              <div className="flex items-center gap-3">
                <IconMail className="h-4 w-4 text-pink-300 flex-shrink-0" />
                <span className="text-sm font-medium">Priority support</span>
              </div>
            </div>

            <div className="mt-auto">
              {(subscriptionStatus?.subscriptionStatus === 'none' ||
                subscriptionStatus?.subscriptionStatus === 'canceled' ||
                subscriptionStatus?.subscriptionStatus === 'trialing') && (
                <GradientButton
                  onClick={() => handleUpgrade(process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID!)}
                  className="w-full"
                >
                  {subscriptionStatus?.subscriptionStatus === 'canceled'
                    ? 'Resume Pro'
                    : subscriptionStatus?.subscriptionStatus === 'trialing'
                      ? 'Continue Pro'
                      : 'Go Pro Yearly'}
                </GradientButton>
              )}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 rounded-2xl"></div>
          <div className="relative z-10">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Billing
              </h2>

              {subscriptionStatus.subscriptionStatus === 'trialing' && (
                <div className=" border border-pink-200/50 dark:border-pink-200/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-pink-300 mb-1">Pro Trial Active</h3>
                      <p className="text-muted text-sm">
                        {subscriptionStatus.trialEndsAt &&
                          `Your trial ends on ${formatDate(subscriptionStatus.trialEndsAt)}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-300 to-pink-400 bg-clip-text text-transparent">
                        $0.00
                      </div>
                      <div className="text-xs text-muted">14-day trial</div>
                    </div>
                  </div>
                </div>
              )}

              {subscriptionStatus.subscriptionStatus === 'active' && (
                <div className="bg-gradient-to-r from-slate-50/50 to-slate-50/50 dark:from-slate-950/30 dark:to-slate-950/30 border border-slate-200/50 dark:border-slate-800/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-pink-300 mb-1">Sugary Pro</h3>
                      <p className="text-muted text-sm">
                        {subscriptionStatus.currentPeriodEnd &&
                          `Next billing: ${formatDate(subscriptionStatus.currentPeriodEnd)}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-300 to-pink-400 bg-clip-text text-transparent">
                        Pro
                      </div>
                      <div className="text-xs text-muted">Active subscription</div>
                    </div>
                  </div>
                </div>
              )}

              {(subscriptionStatus.subscriptionStatus === 'canceled' ||
                subscriptionStatus.subscriptionStatus === 'none') && (
                <div className="bg-gradient-to-r from-neutral-50/50 to-slate-50/50 dark:from-neutral-950/30 dark:to-slate-950/30 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-foreground mb-1">Free Plan</h3>
                      <p className="text-muted text-sm">
                        Want to grow your business faster? Upgrade to a Pro Plan
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-neutral-600 to-slate-600 bg-clip-text text-transparent">
                        $0.00
                      </div>
                      <div className="text-xs text-muted">forever</div>
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
                      No credit card required • 14 days free
                    </p>
                  </div>
                </div>
              )}

              {subscriptionStatus.subscriptionStatus === 'none' &&
                !subscriptionStatus.isNewUser && (
                  <div>
                    {subscriptionStatus.stripeCustomerId ? (
                      <>
                        <button
                          onClick={handleManageBilling}
                          className="group w-full bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base hover:shadow-lg hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                        >
                          <span className="relative z-10">Manage Billing</span>
                          <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </button>
                        <div className="text-center mt-2">
                          <p className="text-xs text-muted">
                            View billing history and payment methods
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-muted">
                          You're currently on the free plan with no billing history.
                        </p>
                      </div>
                    )}
                  </div>
                )}

              {!subscriptionStatus.hasActiveSubscription &&
                subscriptionStatus.subscriptionStatus !== 'none' && (
                  <div>
                    <button
                      onClick={handleManageBilling}
                      className="group w-full bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base hover:shadow-lg hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                    >
                      <span className="relative z-10">Manage Billing</span>
                      <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </button>
                    <div className="text-center mt-2">
                      <p className="text-xs text-muted">View billing history and payment methods</p>
                    </div>
                  </div>
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
                </div>
              )}

              {subscriptionStatus.hasActiveSubscription && (
                <div>
                  <button
                    onClick={handleManageBilling}
                    className="group w-full bg-gradient-to-r from-primary to-secondary text-white px-6 py-4 sm:py-5 rounded-lg font-semibold text-base sm:text-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                  >
                    <span className="relative z-10">Manage Billing</span>
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                  <div className="text-center mt-2">
                    <p className="text-xs text-muted">
                      Update payment method, view invoices, or cancel subscription
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
