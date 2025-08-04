'use client';

import * as React from 'react';
import { IconDashboard, IconPlus, IconExternalLink, IconStar, IconCreditCard, IconClock, IconSparkles } from '@tabler/icons-react';
import { useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import GradientButton from '../app/components/GradientButton';

import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import SugaryLogo from '../app/components/SugaryLogo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const company = useQuery(api.companies.getMyCompany);
  const currentUser = useQuery(api.users.getCurrentUser);
  const subscriptionStatus = useQuery(api.stripe.getSubscriptionStatus);
  const usageStats = useQuery(api.features.getUsageStats);
  const createCheckoutSession = useAction(api.stripe.createCheckoutSession);
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

  const handleStartTrial = async () => {
    try {
      await createTrialSubscription();
    } catch (error) {
      console.error('Failed to start trial:', error);
    }
  };

  const data = {
    navMain: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: IconDashboard,
      },
      {
        title: 'Features',
        url: '/dashboard/features',
        icon: IconStar,
      },
      {
        title: 'Subscription',
        url: '/dashboard/subscription',
        icon: IconCreditCard,
      },
    ],
    quickActions: [
      {
        name: 'New Feature',
        url: '/dashboard/features/new',
        icon: IconPlus,
      },
    ],
    navSecondary: [],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <SugaryLogo size="md" className="justify-center" showText={true} href="/dashboard" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.quickActions} />
        
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {/* Trial/Subscription Banner */}
        {subscriptionStatus && (
          <div className="px-2 mb-2">
            {subscriptionStatus.subscriptionStatus === 'trialing' && (
              <div style={{ background: 'var(--gradient-hero)' }} className="rounded-xl p-3 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <IconSparkles className="h-4 w-4 text-white" />
                  <span className="text-sm font-semibold">Pro Trial Active</span>
                </div>
                {usageStats && (
                  <div className="text-xs text-white/80 mb-2">
                    <div className="flex justify-between items-center">
                      <span>Features</span>
                      <span>{usageStats.features.used}/∞</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-1 mb-3">
                  <IconClock className="h-3 w-3 text-white/80" />
                  <span className="text-xs text-white/80">
                    {subscriptionStatus.trialEndsAt && 
                      `${Math.ceil((subscriptionStatus.trialEndsAt - Date.now()) / (1000 * 60 * 60 * 24))} days remaining`
                    }
                  </span>
                </div>
                <button
                  onClick={handleUpgrade}
                  className="w-full bg-white/20 backdrop-blur text-white text-xs font-medium py-2 px-3 rounded-lg hover:bg-white/30 transition-all border border-white/20"
                >
                  Add Payment Method
                </button>
              </div>
            )}

            {subscriptionStatus.subscriptionStatus === 'none' && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <IconCreditCard className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-semibold text-foreground">Free Plan</span>
                </div>
                <div className="text-xs text-muted mb-3">
                  {usageStats ? (
                    <div className="mb-2">
                      <div className="flex justify-between items-center">
                        <span>Features</span>
                        <span>{usageStats.features.used}/{usageStats.features.limit || '∞'}</span>
                      </div>
                      {usageStats.features.limit && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-gray-400 h-1.5 rounded-full transition-all" 
                            style={{ width: `${Math.min((usageStats.features.used / usageStats.features.limit) * 100, 100)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mb-2 text-orange-500">Loading usage...</div>
                  )}
                  <p>Up to 50 subscribers per feature</p>
                </div>
                <button
                  onClick={handleStartTrial}
                  style={{ background: 'var(--gradient-hero)' }}
                  className="w-full text-white text-xs font-medium py-2 px-3 rounded-lg hover:opacity-90 transition-all mb-2"
                >
                  🎉 Start Free Trial
                </button>
                <button
                  onClick={handleUpgrade}
                  className="w-full border border-gray-200 dark:border-gray-600 text-foreground text-xs font-medium py-1.5 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  Upgrade to Pro
                </button>
              </div>
            )}

            {subscriptionStatus.subscriptionStatus === 'active' && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <IconStar className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-semibold text-foreground">Pro Plan</span>
                </div>
                {usageStats && (
                  <div className="text-xs text-green-600 dark:text-green-400 mb-2">
                    <div className="flex justify-between items-center">
                      <span>Features</span>
                      <span>{usageStats.features.used}/∞</span>
                    </div>
                  </div>
                )}
                <p className="text-xs text-green-600 dark:text-green-400">$9/month • Unlimited everything</p>
              </div>
            )}
          </div>
        )}

        {currentUser && (
          <NavUser
            user={{
              name: currentUser.name || currentUser.email?.split('@')[0] || 'User',
              email: currentUser.email || 'user@sugary.dev',
              avatar: '/avatars/user.jpg',
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
