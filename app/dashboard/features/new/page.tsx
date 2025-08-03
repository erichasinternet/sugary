'use client';

import { useMutation, useQuery } from 'convex/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/convex/_generated/api';
import GradientButton from '../../../components/GradientButton';

export default function NewFeature() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentSlug, setCurrentSlug] = useState('');
  const createFeature = useMutation(api.features.createFeature);
  const company = useQuery(api.companies.getMyCompany);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstFeature = searchParams.get('first') === 'true';

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
      
      // For first feature, show toast and redirect to dashboard
      if (isFirstFeature) {
        // You could add a toast notification here
        router.push('/dashboard');
      } else {
        router.push(`/dashboard/features/${featureId}`);
      }
    } catch (error) {
      console.error('Feature creation error:', error);
      
      // Transform backend errors into user-friendly messages
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('already taken') || errorMessage.includes('already exists')) {
        setError(`The URL "sugary.dev/${company?.slug}/${slug}" is already in use. Please choose a different URL slug.`);
      } else if (errorMessage.includes('Not authenticated')) {
        setError('Your session has expired. Please refresh the page and try again.');
      } else if (errorMessage.includes('No company found')) {
        setError('Please set up your company profile before creating features.');
      } else if (errorMessage.includes('Invalid') || errorMessage.includes('required')) {
        setError('Please check that all required fields are filled out correctly.');
      } else {
        setError('We encountered an issue creating your feature. Please try again in a moment.');
      }
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
          <div className="glass-card-elevated rounded-2xl p-8">
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
          {!isFirstFeature && (
            <Link href="/dashboard" className="text-primary hover:text-primary-dark text-sm font-medium transition-colors">
              ← Back to Dashboard
            </Link>
          )}
          <h1 className="mt-2 text-3xl font-bold gradient-text">
            {isFirstFeature ? 'Create Your First Feature Waitlist' : 'Create New Feature'}
          </h1>
          <p className="mt-2 text-muted">
            {isFirstFeature 
              ? 'Let\'s turn your first scattered feature request into an organized waitlist that builds excitement'
              : 'Set up a waitlist for a new feature request'
            }
          </p>
        </div>


        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 text-amber-500">💡</div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Let's fix this
                    </h3>
                    <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                      {error}
                    </div>
                    {error.includes('already in use') && (
                      <div className="mt-3 text-sm text-amber-600 dark:text-amber-400">
                        <strong>Try this:</strong> Add a number, year, or descriptive word to make it unique 
                        <br />
                        <span className="font-mono text-xs bg-amber-100 dark:bg-amber-800 px-1 py-0.5 rounded">
                          {currentSlug}-2025, {currentSlug}-v2, or {currentSlug}-new
                        </span>
                      </div>
                    )}
                  </div>
                </div>
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
                  const newSlug = generateSlug(e.target.value);
                  const slugInput = document.getElementById('slug') as HTMLInputElement;
                  if (slugInput) {
                    slugInput.value = newSlug;
                    setCurrentSlug(newSlug);
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
                  sugary.dev/{company.slug}/
                </span>
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  required
                  pattern="^[a-z0-9-]+$"
                  className="flex-1 block w-full px-4 py-3 border border-primary/20 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background transition-all duration-200 hover:border-primary/30"
                  placeholder="api-webhooks"
                  onChange={(e) => setCurrentSlug(e.target.value)}
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

            <div className="glass-card-subtle rounded-xl p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 gradient-icon">
                    <span className="text-white text-sm">💡</span>
                  </div>
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
