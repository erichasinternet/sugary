'use client';

import { useQuery } from 'convex/react';
import Link from 'next/link';
import { use, useState } from 'react';
import { SendUpdateModal } from '@/app/components/SendUpdateModal';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

export default function FeatureDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const featureId = id as Id<'features'>;
  const featureData = useQuery(api.features.getFeatureDetails, { featureId });
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  if (featureData === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!featureData) {
    return (
      <div className="px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <span className="text-2xl text-white">❓</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-4">
            Feature not found
          </h2>
          <p className="text-muted mb-8 text-lg">
            This feature might have been removed or you don't have access to it.
          </p>
          <Link
            href="/dashboard"
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { subscribers, company, ...feature } = featureData;
  const featureUrl = `${company.slug}.sugary.dev/${feature.slug}`;

  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/dashboard"
            className="text-primary hover:text-primary-dark text-sm font-medium transition-colors inline-flex items-center gap-2 mb-6"
          >
            ← Back to Dashboard
          </Link>
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-2">
                {feature.title}
              </h1>
              <p className="text-muted font-mono bg-gradient-to-r from-primary/10 to-secondary/10 px-3 py-1 rounded-lg inline-block">
                {featureUrl}
              </p>
            </div>
            <div className="mt-6 sm:mt-0 flex items-center gap-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  feature.status === 'completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : feature.status === 'in_progress'
                      ? 'bg-gradient-to-r from-secondary/20 to-accent/20 text-secondary border border-secondary/30'
                      : feature.status === 'cancelled'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/30'
                }`}
              >
                {feature.status.replace('_', ' ')}
              </span>
              <button
                onClick={() => setShowUpdateModal(true)}
                className="bg-gradient-to-r from-primary to-secondary text-white font-medium py-2 px-4 rounded-xl text-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                📧 Send Update
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-10">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <span className="text-white text-xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted">Total Subscribers</p>
                <p className="text-2xl font-bold text-foreground">{subscribers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-secondary/10 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
                <span className="text-white text-xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted">Confirmed</p>
                <p className="text-2xl font-bold text-foreground">
                  {subscribers.filter((s) => s.confirmed).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-accent/10 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-accent to-primary flex items-center justify-center">
                <span className="text-white text-xl">🔗</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted">Feature Status</p>
                <p className="text-lg font-bold text-foreground capitalize">
                  {feature.status.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Link Section */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                🔗 Share this feature
              </h3>
              <p className="text-muted font-mono bg-white/50 dark:bg-slate-700/50 px-3 py-2 rounded-lg">
                https://{featureUrl}
              </p>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(`https://${featureUrl}`)}
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              📋 Copy Link
            </button>
          </div>
        </div>

        {/* Feature Description */}
        {feature.description && (
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-lg mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              📝 Description
            </h3>
            <p className="text-muted leading-relaxed">{feature.description}</p>
          </div>
        )}

        {/* Subscribers List */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-lg">
          <div className="px-6 py-5 border-b border-primary/10">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent flex items-center gap-2">
              👥 Subscribers ({subscribers.length})
            </h3>
          </div>

          {subscribers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                <span className="text-2xl">📢</span>
              </div>
              <p className="text-muted mb-6 text-lg">
                No subscribers yet. Share your feature link to start collecting interest!
              </p>
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-6 text-left">
                <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  🔗 Your feature link:
                </p>
                <code className="text-sm text-primary font-mono break-all bg-white/50 dark:bg-slate-700/50 px-3 py-2 rounded-lg block">
                  https://{featureUrl}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(`https://${featureUrl}`)}
                  className="mt-4 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  📋 Copy Link
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-primary/10">
              {subscribers.map((subscriber) => (
                <div key={subscriber._id} className="px-6 py-5 hover:bg-primary/5 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            subscriber.confirmed ? 'bg-green-400' : 'bg-gradient-to-r from-secondary to-accent'
                          }`}
                        ></div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-foreground">
                          {subscriber.email}
                        </div>
                        {subscriber.context && (
                          <div className="text-sm text-muted mt-1 italic">
                            "{subscriber.context}"
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          subscriber.confirmed
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-gradient-to-r from-secondary/20 to-accent/20 text-secondary border border-secondary/30'
                        }`}
                      >
                        {subscriber.confirmed ? '✅ Confirmed' : '⏳ Pending'}
                      </span>
                      <span className="text-xs text-muted font-mono">
                        {new Date(subscriber.subscribedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <SendUpdateModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        featureId={featureId}
        featureTitle={feature.title}
        subscriberCount={subscribers.filter((s) => s.confirmed).length}
      />
    </div>
  );
}
