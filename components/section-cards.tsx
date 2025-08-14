'use client';

import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function SectionCards() {
  const features = useQuery(api.features.getMyFeatures);
  const signupTrends = useQuery(api.analytics.getSignupTrends);

  if (features === undefined || signupTrends === undefined) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="@container/card animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-8 bg-muted rounded w-24"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const totalFeatures = features.length;
  const activeFeatures = features.filter(
    (f) => f.status !== 'done',
  ).length;
  const totalSubscribers = features.reduce((sum, f) => sum + f.subscriberCount, 0);
  const monthlySignups = signupTrends.reduce((sum, day) => sum + day.count, 0);

  // Calculate growth from previous period (simple mock for now)
  const featuresGrowth =
    totalFeatures > 0 ? ((activeFeatures / totalFeatures) * 100).toFixed(1) : 0;
  const subscribersGrowth = monthlySignups > 0 ? '+' + monthlySignups : '0';

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Features</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalFeatures}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Feature requests being tracked</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Subscribers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalSubscribers.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {subscribersGrowth}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Users waiting for features</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Monthly Signups</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {monthlySignups}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {monthlySignups > 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {monthlySignups > 0 ? `+${monthlySignups}` : '0'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            {monthlySignups > 0 ? 'Strong engagement' : 'Promote your feature pages'}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Avg per Feature</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalFeatures > 0 ? Math.round(totalSubscribers / totalFeatures) : 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {totalFeatures > 0 ? 'Active' : 'Ready'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            {totalFeatures > 0 ? 'Subscribers per feature' : 'Start collecting feedback'}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
