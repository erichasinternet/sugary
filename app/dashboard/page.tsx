'use client';

import { useQuery } from 'convex/react';
import Link from 'next/link';
import { api } from '@/convex/_generated/api';
import GradientButton from '../components/GradientButton';

export default function Dashboard() {
  const features = useQuery(api.features.getMyFeatures);
  const company = useQuery(api.companies.getMyCompany);
  const signupTrends = useQuery(api.analytics.getSignupTrends);
  const topFeatures = useQuery(api.analytics.getTopFeatures);

  if (
    features === undefined ||
    company === undefined ||
    signupTrends === undefined ||
    topFeatures === undefined
  ) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <span className="text-2xl">✨</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-4">
            Welcome to Sugary!
          </h2>
          <p className="text-muted mb-8 text-lg">
            Let's set up your company to start turning feature requests into engaged communities.
          </p>
          <GradientButton size="lg">
            <Link href="/dashboard/onboarding">
              Set Up Company
            </Link>
          </GradientButton>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Features Dashboard
          </h1>
          <p className="mt-2 text-muted">
            Track engagement and validate demand for your features 📈
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <GradientButton size="md">
            <Link href="/dashboard/features/new">
              Create New Feature
            </Link>
          </GradientButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <span className="text-white text-xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Total Features</p>
              <p className="text-2xl font-bold text-foreground">{features.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-secondary/10 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
              <span className="text-white text-xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Total Subscribers</p>
              <p className="text-2xl font-bold text-foreground">
                {features.reduce((sum, f) => sum + f.subscriberCount, 0)}
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
              <p className="text-sm font-medium text-muted">Your Brand</p>
              <p className="text-lg font-bold text-foreground font-mono">
                {company.slug}.sugary.dev
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="mt-8">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl overflow-hidden rounded-2xl border border-primary/10">
          <div className="px-6 py-5">
            <h3 className="text-lg leading-6 font-semibold text-foreground">
              Your Features
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-muted">
              Manage your feature waitlists and track subscriber interest
            </p>
          </div>

          {features.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-muted mb-6">
                No features created yet. Create your first feature to start collecting interest!
              </p>
              <GradientButton>
                <Link href="/dashboard/features/new">
                  Create Your First Feature
                </Link>
              </GradientButton>
            </div>
          ) : (
            <ul className="divide-y divide-primary/10">
              {features.map((feature) => (
                <li key={feature._id}>
                  <Link
                    href={`/dashboard/features/${feature._id}`}
                    className="block hover:bg-primary/5 transition-colors duration-200"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                feature.status === 'completed'
                                  ? 'bg-green-400'
                                  : feature.status === 'in_progress'
                                    ? 'bg-yellow-400'
                                    : feature.status === 'cancelled'
                                      ? 'bg-red-400'
                                      : 'bg-gray-400'
                              }`}
                            ></div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-foreground">
                              {feature.title}
                            </div>
                            <div className="text-sm text-muted font-mono">
                              {company.slug}.sugary.dev/{feature.slug}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-muted">
                            {feature.subscriberCount} subscribers
                          </div>
                          <div className="text-xs text-muted capitalize">
                            {feature.status.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Analytics Section */}
      {company && features.length > 0 && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Signup Trends */}
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-primary/10">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Signups Last 30 Days
            </h3>
            {signupTrends.length > 0 ? (
              <div className="space-y-2">
                {signupTrends.slice(-7).map((day) => (
                  <div key={day.date} className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(day.date).toLocaleDateString()}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {day.count} signups
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center font-medium">
                    <span className="text-gray-900 dark:text-white">Total (30 days)</span>
                    <span className="text-gray-900 dark:text-white">
                      {signupTrends.reduce((sum, day) => sum + day.count, 0)} signups
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No signups in the last 30 days
              </p>
            )}
          </div>

          {/* Top Features */}
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-primary/10">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Most Requested Features
            </h3>
            {topFeatures.length > 0 ? (
              <div className="space-y-3">
                {topFeatures.map((feature, index) => (
                  <div key={feature.slug} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                        #{index + 1}
                      </span>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {feature.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {feature.status.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {feature.subscriberCount} subscribers
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No features with subscribers yet
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
