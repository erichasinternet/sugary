'use client';

import { useMutation, useQuery } from 'convex/react';
import Link from 'next/link';
import { use, useState } from 'react';
import { api } from '@/convex/_generated/api';
import SugaryLogo from '../../components/SugaryLogo';
import GradientButton from '../../components/GradientButton';

export default function FeatureSignup({
  params,
}: {
  params: Promise<{ company: string; feature: string }>;
}) {
  const { company: companySlug, feature: featureSlug } = use(params);
  const [email, setEmail] = useState('');
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const featureData = useQuery(api.features.getFeatureBySlug, {
    companySlug,
    featureSlug,
  });

  const subscribe = useMutation(api.subscribers.subscribe);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureData) return;

    setIsLoading(true);
    setError('');

    try {
      await subscribe({
        featureId: featureData._id,
        email,
        context: context || undefined,
      });
      setIsSubscribed(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (featureData === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!featureData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
        <div className="max-w-md w-full text-center">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-primary/10">
            <div className="mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Feature Not Found
            </h2>
            <p className="text-muted mb-6">
              The feature you're looking for doesn't exist or has been removed.
            </p>
            <SugaryLogo href="/" className="justify-center" />
          </div>
        </div>
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
        <div className="max-w-md w-full text-center">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-primary/10">
            <div className="mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              You're on the list!
            </h2>
            <p className="text-muted mb-6">
              Thanks for your interest in <strong>{featureData.title}</strong>. We'll send you a
              confirmation email and keep you updated on our progress.
            </p>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-4">
              <p className="text-sm text-primary">
                <strong>What's next?</strong> Check your email for a confirmation link, then sit
                back and we'll update you as we build this feature.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-primary/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-lg font-semibold text-foreground">
                {featureData.company.name}
              </div>
              <span className="text-muted">•</span>
              <span className="text-sm text-muted">Feature Request</span>
            </div>
            <SugaryLogo href="/" size="sm" className="text-sm text-muted hover:text-primary transition-colors" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-primary/10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {featureData.title}
            </h1>
            {featureData.description && (
              <p className="text-lg text-muted">{featureData.description}</p>
            )}
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-center space-x-6 text-sm text-muted">
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    featureData.status === 'completed'
                      ? 'bg-green-400'
                      : featureData.status === 'in_progress'
                        ? 'bg-yellow-400'
                        : featureData.status === 'cancelled'
                          ? 'bg-red-400'
                          : 'bg-gray-400'
                  }`}
                ></div>
                <span className="capitalize">{featureData.status.replace('_', ' ')}</span>
              </div>
              <div>
                Status:{' '}
                {featureData.status === 'planning'
                  ? 'Collecting feedback'
                  : featureData.status === 'in_progress'
                    ? 'In development'
                    : featureData.status === 'completed'
                      ? 'Available now!'
                      : featureData.status === 'cancelled'
                        ? 'Not planned'
                        : 'Planning'}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-primary/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background transition-all duration-200 hover:border-primary/30"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="context"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Why do you need this feature? <span className="text-muted">(Optional)</span>
              </label>
              <textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-primary/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background transition-all duration-200 hover:border-primary/30"
                placeholder="Tell us about your use case, integration needs, or how this would help you..."
              />
              <p className="mt-2 text-sm text-muted">
                This helps the team prioritize and build the right solution.
              </p>
            </div>

            <GradientButton
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding you to the list...
                </span>
              ) : (
                'Get notified when this is ready'
              )}
            </GradientButton>
          </form>

          <div className="mt-8 pt-6 border-t border-primary/10">
            <div className="flex items-center justify-between text-sm text-muted">
              <span>We'll email you updates as we build this feature</span>
              <span>No spam, unsubscribe anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
