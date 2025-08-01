'use client';

import { useMutation } from 'convex/react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { api } from '@/convex/_generated/api';
import SugaryLogo from '../../components/SugaryLogo';
import GradientButton from '../../components/GradientButton';

export default function ConfirmSubscription({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading');
  const [error, setError] = useState('');

  const confirmSubscription = useMutation(api.subscribers.confirmSubscription);

  useEffect(() => {
    const confirm = async () => {
      try {
        await confirmSubscription({ token });
        setStatus('success');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        if (error instanceof Error && error.message.includes('Invalid')) {
          setStatus('invalid');
        } else {
          setStatus('error');
        }
      }
    };

    confirm();
  }, [token, confirmSubscription]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
        <div className="max-w-md w-full text-center">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-primary/10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Confirming your subscription...
            </h2>
            <p className="text-muted">
              Please wait while we verify your email.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
        <div className="max-w-md w-full text-center">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-primary/10">
            <div className="mb-4">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Subscription Confirmed!
            </h2>
            <p className="text-muted mb-6">
              Great! You're now confirmed to receive updates about this feature. We'll email you as
              soon as there's progress to share.
            </p>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-4">
              <p className="text-sm text-primary">
                <strong>What's next?</strong> Keep an eye on your inbox for updates, and feel free
                to reply to our emails with any additional feedback.
              </p>
            </div>
            <div className="mt-6">
              <SugaryLogo href="/" className="justify-center" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
        <div className="max-w-md w-full text-center">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-primary/10">
            <div className="mb-4">
              <span className="text-4xl">🔗</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Invalid Link</h2>
            <p className="text-muted mb-6">
              This confirmation link is invalid or has already been used. If you're trying to
              subscribe to a feature, please use the original signup link.
            </p>
            <GradientButton>
              <Link href="/">
                Go to Sugary
              </Link>
            </GradientButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
      <div className="max-w-md w-full text-center">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-primary/10">
          <div className="mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Something went wrong
          </h2>
          <p className="text-muted mb-6">
            We couldn't confirm your subscription. Please try again or contact support.
          </p>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}
          <SugaryLogo href="/" className="justify-center" />
        </div>
      </div>
    </div>
  );
}
