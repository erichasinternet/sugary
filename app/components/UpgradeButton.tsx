'use client';

import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import GradientButton from './GradientButton';

interface UpgradeButtonProps {
  priceId: string;
  children: React.ReactNode;
}

export function UpgradeButton({ priceId, children }: UpgradeButtonProps) {
  const createCheckoutSession = useMutation(api.stripe.createCheckoutSession);

  const handleUpgrade = async () => {
    try {
      const { url } = await createCheckoutSession({ priceId });
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <GradientButton onClick={handleUpgrade}>
      {children}
    </GradientButton>
  );
}