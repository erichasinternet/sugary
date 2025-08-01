'use client';

import { useMutation, useQuery } from 'convex/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/convex/_generated/api';

export default function NewFeature() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const createFeature = useMutation(api.features.createFeature);
  const company = useQuery(api.companies.getMyCompany);
  const router = useRouter();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;

    try {
      const featureId = await createFeature({
        title,
        slug,
        description: description || undefined,
      });
      router.push(`/dashboard/features/${featureId}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (company === undefined) {
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
            <span className="text-2xl">🏢</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-4">
            Company Setup Required
          </h2>
          <p className="text-muted mb-8 text-lg">
            Set up your company first to start creating feature waitlists.
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
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <Link
            href="/dashboard"
            className="text-primary hover:text-primary-dark text-sm font-medium transition-colors inline-flex items-center gap-2 mb-6"
          >
            ← Back to Dashboard
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-4">
              Create New Feature
            </h1>
            <p className="text-muted text-lg">
              Generate a trackable link to validate demand and capture interest 🚀
            </p>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-foreground mb-3">
                🎯 Feature Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                className="block w-full px-4 py-3 border border-primary/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background transition-all duration-200 hover:border-primary/30 text-foreground"
                placeholder="e.g., API Webhooks, Dark Mode, Mobile App"
                onChange={(e) => {
                  const slugInput = document.getElementById('slug') as HTMLInputElement;
                  if (slugInput) {
                    slugInput.value = generateSlug(e.target.value);
                  }
                }}
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-semibold text-foreground mb-3">
                🔗 Feature URL
              </label>
              <div className="flex rounded-xl shadow-sm border border-primary/20 overflow-hidden hover:border-primary/30 transition-colors duration-200">
                <span className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-mono text-sm font-medium border-r border-primary/20">
                  {company.slug}.sugary.dev/
                </span>
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  required
                  pattern="^[a-z0-9-]+$"
                  className="flex-1 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background text-foreground font-mono"
                  placeholder="api-webhooks"
                />
              </div>
              <p className="mt-3 text-sm text-muted">
                💡 Share this URL anywhere users request this feature - Discord, Reddit, support
                tickets, etc.
              </p>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-foreground mb-3"
              >
                📝 Description (Optional)
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                className="block w-full px-4 py-3 border border-primary/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background transition-all duration-200 hover:border-primary/30 text-foreground resize-none"
                placeholder="Help users understand what this feature will do and why they need it. This helps create better engagement and more detailed feedback."
              />
            </div>

            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                    <span className="text-white text-lg">🚀</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Developer Pro Tip</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    After creating your feature, you'll get analytics on user engagement, detailed
                    feedback, and email collection. Perfect for validating demand before you start
                    coding!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Creating your feature...
                  </>
                ) : (
                  <>✨ Create Feature</>
                )}
              </button>
              <Link
                href="/dashboard"
                className="bg-white/90 dark:bg-slate-700/90 hover:bg-white dark:hover:bg-slate-700 text-foreground py-3 px-6 rounded-xl font-semibold border border-primary/20 hover:border-primary/30 transition-all duration-300 flex items-center justify-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
