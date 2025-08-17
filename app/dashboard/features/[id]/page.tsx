'use client';

import { useQuery } from 'convex/react';
import Link from 'next/link';
import { use, useState } from 'react';
import { SendUpdateModal } from '@/app/components/SendUpdateModal';
import { api } from '@/convex/_generated/api';
import type { Id, Doc } from '@/convex/_generated/dataModel';
import GradientButton from '../../../components/GradientButton';

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
      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card-elevated rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Feature not found
            </h2>
            <Link href="/dashboard" className="text-primary hover:text-primary-dark transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { subscribers, company, ...feature } = featureData;
  const featureUrl = `sugary.dev/${company.slug}/${feature.slug}`;

  return (
    <div className="px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-primary hover:text-primary-dark text-sm font-medium transition-colors">
            ← Back to Dashboard
          </Link>
          <div className="mt-4 sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">{feature.title}</h1>
              <p className="mt-1 text-sm text-muted font-mono">{featureUrl}</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                  feature.status === 'done'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : feature.status === 'in_progress'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : feature.status === 'requested'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : feature.status === 'cancelled'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {feature.status === 'todo' ? 'To Do' : 
                 feature.status === 'in_progress' ? 'In Progress' :
                 feature.status.charAt(0).toUpperCase() + feature.status.slice(1)}
              </span>
              <GradientButton
                onClick={() => setShowUpdateModal(true)}
                size="sm"
              >
                Send Update
              </GradientButton>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="glass-card overflow-hidden rounded-2xl">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 gradient-icon">
                    <span className="text-white text-sm">👥</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted truncate">
                      Total Subscribers
                    </dt>
                    <dd className="text-lg font-medium text-foreground">
                      {subscribers.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card overflow-hidden rounded-2xl">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 gradient-icon">
                    <span className="text-white text-sm">✅</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted truncate">
                      Confirmed
                    </dt>
                    <dd className="text-lg font-medium text-foreground">
                      {subscribers.filter((s: Doc<'subscribers'>) => s.confirmed).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card overflow-hidden rounded-2xl">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 gradient-icon">
                    <span className="text-white text-sm">🔗</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted truncate">
                      Share Link
                    </dt>
                    <dd className="text-sm font-medium text-foreground">
                      <button
                        onClick={() => navigator.clipboard.writeText(`https://${featureUrl}`)}
                        className="text-primary hover:text-primary-dark transition-colors"
                      >
                        Copy URL
                      </button>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Description */}
        {feature.description && (
          <div className="glass-card rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
            <p className="text-muted">{feature.description}</p>
          </div>
        )}

        {/* Subscribers List */}
        <div className="glass-card rounded-2xl">
          <div className="px-6 py-4 border-b border-primary/10">
            <h3 className="text-lg font-semibold text-foreground">
              Subscribers ({subscribers.length})
            </h3>
          </div>

          {subscribers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-muted mb-4">
                No subscribers yet. Share your feature link to start collecting interest!
              </p>
              <div className="glass-card-subtle rounded-xl p-4 text-left">
                <p className="text-sm font-semibold text-foreground mb-2">
                  Your feature link:
                </p>
                <code className="text-sm text-primary break-all font-mono">
                  https://{featureUrl}
                </code>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-primary/10">
              {subscribers.map((subscriber: Doc<'subscribers'>) => (
                <div key={subscriber._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div
                          className={`status-indicator ${
                            subscriber.confirmed ? 'status-completed' : 'status-in-progress'
                          }`}
                        ></div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">
                          {subscriber.email}
                        </div>
                        {subscriber.context && (
                          <div className="text-sm text-muted">
                            "{subscriber.context}"
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          subscriber.confirmed
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}
                      >
                        {subscriber.confirmed ? 'Confirmed' : 'Pending'}
                      </span>
                      <span className="text-xs text-muted">
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
        subscriberCount={subscribers.filter((s: Doc<'subscribers'>) => s.confirmed).length}
      />
    </div>
  );
}
