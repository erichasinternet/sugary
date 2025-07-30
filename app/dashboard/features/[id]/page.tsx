"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function FeatureDetail({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  const featureId = id as Id<"features">;
  const featureData = useQuery(api.features.getFeatureDetails, { featureId });

  if (featureData === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!featureData) {
    return (
      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Feature not found
          </h2>
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-500"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { subscribers, company, ...feature } = featureData;
  const featureUrl = `${company.slug}.featureloop.com/${feature.slug}`;

  return (
    <div className="px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            ← Back to Dashboard
          </Link>
          <div className="mt-4 sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {feature.title}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {featureUrl}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                feature.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                feature.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                feature.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {feature.status.replace('_', ' ')}
              </span>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm">
                Send Update
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-sm">👥</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Subscribers
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {subscribers.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-sm">✅</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Confirmed
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {subscribers.filter(s => s.confirmed).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 text-sm">🔗</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Share Link
                    </dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">
                      <button
                        onClick={() => navigator.clipboard.writeText(`https://${featureUrl}`)}
                        className="text-blue-600 hover:text-blue-500"
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
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Description
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {feature.description}
            </p>
          </div>
        )}

        {/* Subscribers List */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Subscribers ({subscribers.length})
            </h3>
          </div>
          
          {subscribers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No subscribers yet. Share your feature link to start collecting interest!
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Your feature link:
                </p>
                <code className="text-sm text-blue-600 dark:text-blue-400 break-all">
                  https://{featureUrl}
                </code>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {subscribers.map((subscriber) => (
                <div key={subscriber._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${
                          subscriber.confirmed ? 'bg-green-400' : 'bg-yellow-400'
                        }`}></div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {subscriber.email}
                        </div>
                        {subscriber.context && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            "{subscriber.context}"
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subscriber.confirmed 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {subscriber.confirmed ? 'Confirmed' : 'Pending'}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
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
    </div>
  );
}