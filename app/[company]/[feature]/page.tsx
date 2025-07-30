"use client";

import { use, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";

export default function FeatureSignup({ 
  params 
}: { 
  params: Promise<{ company: string; feature: string }> 
}) {
  const { company: companySlug, feature: featureSlug } = use(params);
  const [email, setEmail] = useState("");
  const [context, setContext] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState("");

  const featureData = useQuery(api.features.getFeatureBySlug, {
    companySlug,
    featureSlug,
  });

  const subscribe = useMutation(api.subscribers.subscribe);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureData) return;

    setIsLoading(true);
    setError("");

    try {
      await subscribe({
        featureId: featureData._id,
        email,
        context: context || undefined,
      });
      setIsSubscribed(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (featureData === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!featureData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            <div className="mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Feature Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The feature you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Go to FeatureLoop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            <div className="mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              You're on the list!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Thanks for your interest in <strong>{featureData.title}</strong>. 
              We'll send you a confirmation email and keep you updated on our progress.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>What's next?</strong> Check your email for a confirmation link, 
                then sit back and we'll update you as we build this feature.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {featureData.company.name}
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Feature Request
              </span>
            </div>
            <Link
              href="/"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Powered by FeatureLoop
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {featureData.title}
            </h1>
            {featureData.description && (
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {featureData.description}
              </p>
            )}
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  featureData.status === 'completed' ? 'bg-green-400' :
                  featureData.status === 'in_progress' ? 'bg-yellow-400' :
                  featureData.status === 'cancelled' ? 'bg-red-400' :
                  'bg-gray-400'
                }`}></div>
                <span className="capitalize">
                  {featureData.status.replace('_', ' ')}
                </span>
              </div>
              <div>
                Status: {
                  featureData.status === 'planning' ? 'Collecting feedback' :
                  featureData.status === 'in_progress' ? 'In development' :
                  featureData.status === 'completed' ? 'Available now!' :
                  featureData.status === 'cancelled' ? 'Not planned' :
                  'Planning'
                }
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="context" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Why do you need this feature? <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Tell us about your use case, integration needs, or how this would help you..."
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                This helps the team prioritize and build the right solution.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding you to the list...
                </span>
              ) : (
                "Get notified when this is ready"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>We'll email you updates as we build this feature</span>
              <span>No spam, unsubscribe anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}