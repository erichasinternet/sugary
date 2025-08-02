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
      <div className="px-4 py-16">
        <div className="glass-card-elevated rounded-3xl p-12 mx-4 sm:mx-8 max-w-2xl mx-auto text-center relative overflow-hidden">
          {/* Floating elements */}
          <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-gradient-to-r from-accent/20 to-accent-light/20 animate-float"></div>
          <div className="absolute top-12 right-8 w-8 h-8 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-8 left-1/4 w-6 h-6 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 animate-float" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-8 gradient-icon">
              <span className="text-3xl">✨</span>
            </div>
            <h2 className="text-4xl font-bold gradient-text mb-6">
              Welcome to Sugary!
            </h2>
            <p className="text-muted mb-10 text-lg leading-relaxed">
              Let's set up your company to start turning feature requests into engaged communities.
              <span className="block mt-2 text-foreground font-medium">This will only take 30 seconds! 🚀</span>
            </p>
            <GradientButton size="lg">
              <Link href="/dashboard/onboarding" className="flex items-center gap-2">
                Set Up Company
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </GradientButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 gradient-icon">
            <span className="text-white text-xl">📊</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text">
              Dashboard
            </h1>
            <p className="text-muted text-lg">
              Welcome back! Here's how your features are performing
            </p>
          </div>
        </div>
        
        {/* Quick actions */}
        <div className="flex flex-wrap gap-3">
          <GradientButton size="md">
            <Link href="/dashboard/features/new" className="flex items-center gap-2">
              <span>✨</span>
              Create Feature
            </Link>
          </GradientButton>
          <Link
            href={`https://${company.slug}.sugary.dev`}
            target="_blank"
            rel="noopener noreferrer"
            className="group glass-card-subtle px-6 py-3 rounded-xl font-medium flex items-center gap-2"
          >
            <span>🌐</span>
            View Public Page
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">↗</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-12">
        <div className="glass-card rounded-2xl p-6 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 gradient-icon">
              <span className="text-white text-xl">🎯</span>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground">{features.length}</p>
              <p className="text-sm font-medium text-muted">Features</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Active</span>
              <span className="font-medium text-foreground">
                {features.filter(f => f.status !== 'cancelled' && f.status !== 'completed').length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">In Progress</span>
              <span className="font-medium text-foreground">
                {features.filter(f => f.status === 'in_progress').length}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 gradient-icon">
              <span className="text-white text-xl">👥</span>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground">
                {features.reduce((sum, f) => sum + f.subscriberCount, 0)}
              </p>
              <p className="text-sm font-medium text-muted">Subscribers</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">This month</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                +{signupTrends.reduce((sum, day) => sum + day.count, 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Avg per feature</span>
              <span className="font-medium text-foreground">
                {features.length > 0 ? Math.round(features.reduce((sum, f) => sum + f.subscriberCount, 0) / features.length) : 0}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 gradient-icon">
              <span className="text-white text-xl">🌟</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground font-mono">
                {company.slug}.sugary.dev
              </p>
              <p className="text-sm font-medium text-muted">Your Brand</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live and ready for requests</span>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Your Features</h2>
            <p className="text-muted">Manage your feature waitlists and track subscriber interest</p>
          </div>
          {features.length > 0 && (
            <GradientButton size="sm">
              <Link href="/dashboard/features/new" className="flex items-center gap-2">
                <span>✨</span>
                Add Feature
              </Link>
            </GradientButton>
          )}
        </div>

        {features.length === 0 ? (
          <div className="glass-card-elevated rounded-3xl p-16 text-center relative overflow-hidden">
            {/* Floating elements */}
            <div className="absolute top-8 left-8 w-16 h-16 rounded-full bg-gradient-to-r from-accent/10 to-accent-light/10 animate-float"></div>
            <div className="absolute top-12 right-12 w-12 h-12 rounded-full bg-gradient-to-r from-secondary/10 to-primary/10 animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-12 left-1/4 w-8 h-8 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 animate-float" style={{ animationDelay: '2s' }}></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto mb-6 gradient-icon opacity-30">
                <span className="text-4xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Ready to capture your first requests?</h3>
              <p className="text-muted mb-8 text-lg max-w-md mx-auto">
                Create your first feature page and start turning scattered requests into organized waitlists.
              </p>
              <GradientButton size="lg">
                <Link href="/dashboard/features/new" className="flex items-center gap-2">
                  <span>✨</span>
                  Create Your First Feature
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
              </GradientButton>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {features.map((feature, index) => (
              <Link
                key={feature._id}
                href={`/dashboard/features/${feature._id}`}
                className="glass-card rounded-xl p-6 group block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`status-indicator ${
                        feature.status === 'completed'
                          ? 'status-completed'
                          : feature.status === 'in_progress'
                            ? 'status-in-progress'
                            : feature.status === 'cancelled'
                              ? 'status-cancelled'
                              : 'status-pending'
                      }`}>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors duration-200">
                        {feature.title}
                      </h3>
                      <p className="text-muted font-mono text-sm">
                        {company.slug}.sugary.dev/{feature.slug}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {feature.subscriberCount}
                      </p>
                      <p className="text-sm text-muted">subscribers</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        feature.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : feature.status === 'in_progress'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                            : feature.status === 'cancelled'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                      }`}>
                        {feature.status.replace('_', ' ')}
                      </span>
                      
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                        <span className="text-primary text-xs group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Analytics Section */}
      {company && features.length > 0 && (
        <div className="mt-16 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Analytics</h2>
            <p className="text-muted">Insights to help you understand demand</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Signup Trends */}
            <div className="glass-card rounded-2xl p-6 group">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 gradient-icon">
                  <span className="text-white text-lg">📈</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
                  <p className="text-sm text-muted">Last 7 days</p>
                </div>
              </div>
              
              {signupTrends.length > 0 ? (
                <div className="space-y-3">
                  {signupTrends.slice(-7).map((day, index) => (
                    <div key={day.date} className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-primary/5 transition-colors duration-200">
                      <span className="text-sm font-medium text-foreground">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                            style={{ 
                              width: `${Math.max(5, (day.count / Math.max(...signupTrends.slice(-7).map(d => d.count), 1)) * 100)}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-foreground min-w-[3rem] text-right">
                          {day.count}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 mt-4 border-t border-primary/10">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">Total (30 days)</span>
                      <span className="text-xl font-bold text-primary">
                        {signupTrends.reduce((sum, day) => sum + day.count, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/10 flex items-center justify-center">
                    <span className="text-2xl text-muted">📊</span>
                  </div>
                  <p className="text-muted">No signups yet</p>
                  <p className="text-sm text-muted mt-1">Share your feature pages to start tracking!</p>
                </div>
              )}
            </div>

            {/* Top Features */}
            <div className="glass-card rounded-2xl p-6 group">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 gradient-icon">
                  <span className="text-white text-lg">🏆</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Top Features</h3>
                  <p className="text-sm text-muted">By subscriber count</p>
                </div>
              </div>
              
              {topFeatures.length > 0 ? (
                <div className="space-y-3">
                  {topFeatures.slice(0, 5).map((feature, index) => (
                    <div key={feature.slug} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-primary/5 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-amber-600 text-white' :
                          'bg-muted/20 text-muted'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {feature.title}
                          </div>
                          <div className="text-xs text-muted capitalize flex items-center gap-1">
                            <div className={`status-indicator ${
                              feature.status === 'completed' ? 'status-completed' :
                              feature.status === 'in_progress' ? 'status-in-progress' :
                              feature.status === 'cancelled' ? 'status-cancelled' :
                              'status-pending'
                            }`}></div>
                            {feature.status.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">
                          {feature.subscriberCount}
                        </div>
                        <div className="text-xs text-muted">subscribers</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/10 flex items-center justify-center">
                    <span className="text-2xl text-muted">🎯</span>
                  </div>
                  <p className="text-muted">No features with subscribers yet</p>
                  <p className="text-sm text-muted mt-1">Create features and share them to see rankings!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
