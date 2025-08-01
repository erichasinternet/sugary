'use client';

import { useMutation, useQuery } from 'convex/react';
import Link from 'next/link';
import { use, useState, useMemo } from 'react';
import { api } from '@/convex/_generated/api';

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

  const trackAnalytics = useMutation(api.analytics.trackAnalytics);

  // Track page view once when feature data loads
  const [hasTrackedView, setHasTrackedView] = useState(false);

  useMemo(() => {
    if (featureData && !hasTrackedView && typeof window !== 'undefined') {
      // Get browser info for analytics
      const metadata = {
        referrer: document.referrer || undefined,
        userAgent: navigator.userAgent,
      };

      trackAnalytics({
        featureId: featureData._id,
        type: 'page_view',
        metadata,
      }).catch(error => {
        // Silent fail - don't break the page if analytics fails
        console.debug('Analytics tracking failed:', error);
      });

      setHasTrackedView(true);
    }
  }, [featureData, hasTrackedView, trackAnalytics]);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!featureData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-md w-full text-center">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-primary/10">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <span className="text-2xl text-white">🔍</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-4">
              Feature Not Found
            </h2>
            <p className="text-muted mb-8 text-lg">
              The feature you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/"
              className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
            >
              🏠 Go to Sugary
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-md w-full text-center">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-primary/10">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center animate-pulse">
              <span className="text-2xl text-white">✅</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-4">
              You're on the list!
            </h2>
            <p className="text-muted mb-6 text-lg">
              Thanks for your interest in <strong className="text-primary">{featureData.title}</strong>. We'll send you a
              confirmation email and keep you updated on our progress.
            </p>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6">
              <p className="text-sm text-foreground">
                <strong className="text-primary">🚀 What's next?</strong> Check your email for a confirmation link, then sit
                back and we'll update you as we build this feature!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {featureData.company.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-lg font-semibold text-foreground">
                {featureData.company.name}
              </div>
              <span className="text-primary">•</span>
              <span className="text-sm text-muted">Feature Request</span>
            </div>
            <Link
              href="/"
              className="text-sm text-primary hover:text-primary-dark font-medium transition-colors flex items-center gap-1"
            >
              ✨ Powered by Sugary
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-primary/10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-4">
              {featureData.title}
            </h1>
            {featureData.description && (
              <p className="text-lg text-muted leading-relaxed">{featureData.description}</p>
            )}
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-2 rounded-full border border-primary/20">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    featureData.status === 'completed'
                      ? 'bg-green-400'
                      : featureData.status === 'in_progress'
                        ? 'bg-gradient-to-r from-secondary to-accent'
                        : featureData.status === 'cancelled'
                          ? 'bg-red-400'
                          : 'bg-gradient-to-r from-primary to-secondary'
                  }`}
                ></div>
                <span className="capitalize font-medium text-primary">{featureData.status.replace('_', ' ')}</span>
              </div>
              <div className="text-muted font-medium">
                {featureData.status === 'planning'
                  ? '📈 Collecting feedback'
                  : featureData.status === 'in_progress'
                    ? '🔧 In development'
                    : featureData.status === 'completed'
                      ? '✅ Available now!'
                      : featureData.status === 'cancelled'
                        ? '❌ Not planned'
                        : '📈 Planning'}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-foreground mb-3"
              >
                📧 Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-primary/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background transition-all duration-200 hover:border-primary/30 text-foreground"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="context"
                className="block text-sm font-semibold text-foreground mb-3"
              >
                💬 Why do you need this feature? <span className="text-muted">(Optional)</span>
              </label>
              <textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-primary/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background transition-all duration-200 hover:border-primary/30 text-foreground resize-none"
                placeholder="Tell us about your use case, integration needs, or how this would help you..."
              />
              <p className="mt-3 text-sm text-muted">
                💡 This helps the team prioritize and build the right solution.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Adding you to the list...
                </>
              ) : (
                <>🔔 Get notified when this is ready</>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-primary/10">
            <div className="flex items-center justify-between text-sm text-muted">
              <span className="flex items-center gap-1">
                📧 We'll email you updates as we build this feature
              </span>
              <span className="flex items-center gap-1">
                ✨ No spam, unsubscribe anytime
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
