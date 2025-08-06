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
  const checkPaymentMethod = useAction(api.stripe.checkPaymentMethod);
  
  // Check if trial user has payment method
  const [hasPaymentMethod, setHasPaymentMethod] = React.useState<boolean | null>(null);
  
  React.useEffect(() => {
    if (subscriptionStatus?.subscriptionStatus === 'trialing' && subscriptionStatus?.stripeCustomerId) {
      checkPaymentMethod().then(result => setHasPaymentMethod(result.hasPaymentMethod));
    }
  }, [subscriptionStatus, checkPaymentMethod]);

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
        {/* Subscription status - Hide for active Pro subscribers and trial users with payment method */}
        {subscriptionStatus && 
         subscriptionStatus.subscriptionStatus !== 'active' && 
         !(subscriptionStatus.subscriptionStatus === 'trialing' && hasPaymentMethod === true) && (
          <div className="px-2 mb-2">
            {subscriptionStatus.subscriptionStatus === 'trialing' && hasPaymentMethod !== true && (
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

            {subscriptionStatus.subscriptionStatus === 'none' && !subscriptionStatus.trialExpired && (
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
                  onClick={handleUpgrade}
                  style={{ background: 'var(--gradient-hero)' }}
                  className="w-full text-white text-xs font-medium py-2 px-3 rounded-lg hover:opacity-90 transition-all"
                >
                  Upgrade to Pro - $9/mo
                </button>
              </div>
            )}

            {subscriptionStatus.trialExpired && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <IconSparkles className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Trial Ended</span>
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400 mb-3">
                  {usageStats ? (
                    <div className="mb-2">
                      <div className="flex justify-between items-center">
                        <span>Features</span>
                        <span>{usageStats.features.used}/{usageStats.features.limit || '∞'}</span>
                      </div>
                      {usageStats.features.limit && (
                        <div className="w-full bg-purple-200 dark:bg-purple-700 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-purple-400 h-1.5 rounded-full transition-all" 
                            style={{ width: `${Math.min((usageStats.features.used / usageStats.features.limit) * 100, 100)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mb-2 text-purple-500">Loading usage...</div>
                  )}
                  <p>Back to Free limits. Upgrade anytime!</p>
                </div>
                <button
                  onClick={handleUpgrade}
                  style={{ background: 'var(--gradient-hero)' }}
                  className="w-full text-white text-xs font-medium py-2 px-3 rounded-lg hover:opacity-90 transition-all"
                >
                  Upgrade to Pro - $9/mo
                </button>
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
