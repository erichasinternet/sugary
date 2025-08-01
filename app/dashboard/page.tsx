'use client';

import { useQuery } from 'convex/react';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/convex/_generated/api';

// Secure domain matching helper
function getSourceIcon(source: string): string {
  if (source === 'Direct') return '🔗';
  
  // Use exact domain matching instead of substring matching
  const validDomains = new Set([
    'twitter.com',
    'x.com', 
    'reddit.com',
    'github.com',
    'linkedin.com'
  ]);
  
  if (validDomains.has(source)) {
    switch (source) {
      case 'twitter.com':
      case 'x.com':
        return '🐦';
      case 'reddit.com':
        return '🗿';
      case 'github.com':
        return '🐱';
      case 'linkedin.com':
        return '💼';
      default:
        return '🌐';
    }
  }
  
  return '🌐';
}

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const features = useQuery(api.features.getMyFeatures);
  const company = useQuery(api.companies.getMyCompany);
  const insights = useQuery(api.analytics.getDashboardInsights, { timeframe });

  if (features === undefined || company === undefined || insights === undefined) {
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
          <Link
            href="/dashboard/onboarding"
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
          >
            🚀 Set Up Company
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-muted text-lg">
            Track engagement and validate demand for your features 📊
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-4">
          {/* Timeframe Selector */}
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as '7d' | '30d' | '90d')}
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-primary/20 rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Link
            href="/dashboard/features/new"
            className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
          >
            ✨ Create Feature
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <span className="text-white text-xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Total Features</p>
              <p className="text-2xl font-bold text-foreground">{insights.overview.totalFeatures}</p>
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
              <p className="text-2xl font-bold text-foreground">{insights.overview.totalSubscribers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-accent/10 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-accent to-primary flex items-center justify-center">
              <span className="text-white text-xl">👀</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Page Views</p>
              <p className="text-2xl font-bold text-foreground">{insights.overview.totalViews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
              <span className="text-white text-xl">🎯</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Conversion Rate</p>
              <p className="text-2xl font-bold text-foreground">{insights.overview.conversionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Cards */}
      {insights.insights && insights.insights.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            💡 Key Insights
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insights.insights.map((insight, index) => (
              <div
                key={index}
                className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border shadow-lg ${
                  insight.type === 'success'
                    ? 'border-green-200 dark:border-green-800'
                    : insight.type === 'warning'
                    ? 'border-yellow-200 dark:border-yellow-800'
                    : 'border-blue-200 dark:border-blue-800'
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      insight.type === 'success'
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : insight.type === 'warning'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30'
                        : 'bg-blue-100 dark:bg-blue-900/30'
                    }`}
                  >
                    <span className="text-lg">
                      {insight.type === 'success' ? '🎉' : insight.type === 'warning' ? '⚠️' : 'ℹ️'}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-foreground">{insight.title}</h3>
                    <p className="text-muted mt-1">{insight.message}</p>
                    <p className="text-sm text-primary mt-2 font-medium">{insight.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Trends Chart */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            📈 Engagement Trends
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-muted mb-2">
                <span>📊 Page Views</span>
                <span>{insights.trends.views.reduce((sum, day) => sum + day.count, 0)} total</span>
              </div>
              <div className="space-y-2">
                {insights.trends.views.slice(-7).map((day) => (
                  <div key={day.date} className="flex justify-between items-center">
                    <span className="text-sm text-muted">
                      {new Date(day.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full"
                        style={{ width: `${Math.max(8, (day.count / Math.max(...insights.trends.views.map(d => d.count), 1)) * 60)}px` }}
                      ></div>
                      <span className="text-sm font-semibold text-foreground w-8 text-right">
                        {day.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-muted mb-2">
                <span>👥 Signups</span>
                <span>{insights.trends.signups.reduce((sum, day) => sum + day.count, 0)} total</span>
              </div>
              <div className="space-y-2">
                {insights.trends.signups.slice(-7).map((day) => (
                  <div key={day.date} className="flex justify-between items-center">
                    <span className="text-sm text-muted">
                      {new Date(day.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-secondary to-accent rounded-full"
                        style={{ width: `${Math.max(8, (day.count / Math.max(...insights.trends.signups.map(d => d.count), 1)) * 60)}px` }}
                      ></div>
                      <span className="text-sm font-semibold text-foreground w-8 text-right">
                        {day.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-secondary/10 shadow-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            🌐 Traffic Sources
          </h3>
          {insights.traffic.sources.length > 0 ? (
            <div className="space-y-3">
              {insights.traffic.sources.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {getSourceIcon(source.source)}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {source.source === 'Direct' ? 'Direct' : source.source}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-2 bg-gradient-to-r from-secondary to-accent rounded-full"
                      style={{ width: `${Math.max(8, (source.count / Math.max(...insights.traffic.sources.map(s => s.count), 1)) * 80)}px` }}
                    ></div>
                    <span className="text-sm font-semibold text-secondary">
                      {source.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm">No traffic data available yet</p>
          )}
        </div>
      </div>

      {/* Feature Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Features by Views */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-accent/10 shadow-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            🔥 Most Viewed Features
          </h3>
          {insights.features.length > 0 ? (
            <div className="space-y-3">
              {insights.features.slice(0, 5).map((feature, index) => (
                <Link
                  key={feature.id}
                  href={`/dashboard/features/${feature.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-accent w-6">
                      #{index + 1}
                    </span>
                    <div className="ml-3">
                      <div className="text-sm font-semibold text-foreground">
                        {feature.title}
                      </div>
                      <div className="text-xs text-muted capitalize">
                        {feature.status.replace('_', ' ')} • {feature.conversionRate}% conversion
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-accent">
                      {feature.views} views
                    </div>
                    <div className="text-xs text-muted">
                      {feature.subscribers} subscribers
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm">No features created yet</p>
          )}
        </div>

        {/* Device Breakdown */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            📱 Device Usage
          </h3>
          {insights.traffic.devices.length > 0 ? (
            <div className="space-y-3">
              {insights.traffic.devices.map((device) => {
                const total = insights.traffic.devices.reduce((sum, d) => sum + d.count, 0);
                const percentage = total > 0 ? Math.round((device.count / total) * 100) : 0;
                return (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {device.device === 'Mobile' ? '📱' :
                         device.device === 'Tablet' ? '📱' :
                         device.device === 'Desktop' ? '💻' : '❓'}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {device.device}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full"
                        style={{ width: `${Math.max(8, percentage)}px` }}
                      ></div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-primary">
                          {percentage}%
                        </div>
                        <div className="text-xs text-muted">
                          {device.count} visits
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted text-sm">No device data available yet</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {insights.recent.length > 0 && (
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            ⏰ Recent Activity
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {insights.recent.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-sm">
                    {activity.type === 'page_view' ? '👀' : 
                     activity.type === 'email_click' ? '📧' : '🔗'}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {activity.featureTitle}
                    </div>
                    <div className="text-xs text-muted">
                      from {activity.referrer === 'Direct' ? '🔗 Direct' : `🌐 ${activity.referrer}`}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted">
                  {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}