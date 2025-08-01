'use client';

import { useMutation, useQuery } from 'convex/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/convex/_generated/api';
import GradientButton from '../../../components/GradientButton';

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
      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 shadow-xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              No company found
            </h2>
            <p className="text-muted mb-8">
              You need to set up a company before creating features.
            </p>
            <GradientButton>
              <Link href="/dashboard/onboarding">
                Set Up Company
              </Link>
            </GradientButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="text-primary hover:text-primary-dark text-sm font-medium transition-colors">
            ← Back to Dashboard
          </Link>
          <h1 className="mt-2 text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Create New Feature
          </h1>
          <p className="mt-2 text-muted">
            Set up a waitlist for a new feature request
          </p>
        </div>

        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-primary/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Feature Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                className="block w-full px-4 py-3 border border-primary/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background transition-all duration-200 hover:border-primary/30"
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
              <label
                htmlFor="slug"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                URL Slug
              </label>
              <div className="flex rounded-xl shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-primary/20 bg-primary/5 text-muted text-sm font-mono">
                  {company.slug}.sugary.dev/
                </span>
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  required
                  pattern="^[a-z0-9-]+$"
                  className="flex-1 block w-full px-4 py-3 border border-primary/20 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background transition-all duration-200 hover:border-primary/30"
                  placeholder="api-webhooks"
                />
              </div>
              <p className="mt-2 text-sm text-muted">
                This will be the unique URL where users can sign up for this feature
              </p>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Description (Optional)
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                className="block w-full px-4 py-3 border border-primary/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background transition-all duration-200 hover:border-primary/30"
                placeholder="Describe what this feature will do and why users might want it..."
              />
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-primary text-lg">💡</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-primary">Pro Tip</h3>
                  <div className="mt-2 text-sm text-primary">
                    <p>
                      Once created, you can share your feature link anywhere users request this
                      feature - on Reddit, Twitter, support tickets, or anywhere else!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <GradientButton
                type="submit"
                disabled={isLoading}
                className="flex-1"
                size="lg"
              >
                {isLoading ? 'Creating...' : 'Create Feature'}
              </GradientButton>
              <GradientButton
                variant="secondary"
                className="px-8"
                size="lg"
              >
                <Link href="/dashboard">
                  Cancel
                </Link>
              </GradientButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
