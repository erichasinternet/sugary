'use client';

import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { api } from '@/convex/_generated/api';
import GradientButton from '../../components/GradientButton';

export default function Onboarding() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const createCompany = useMutation(api.companies.createCompany);
  const currentUser = useQuery(api.users.getCurrentUser);
  const router = useRouter();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;

    try {
      await createCompany({ name, slug });
      // Redirect to feature creation to get immediate value
      router.push('/dashboard/features/new?first=true');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pink-300">
            Ready to organize those scattered requests?
          </h1>
          <p className="mt-2 text-muted">
            Let's set up your company profile so you can start turning feature requests into
            organized waitlists
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="block w-full px-4 py-3 border border-primary/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background transition-all duration-200 hover:border-primary/30"
                placeholder="Enter your company name"
                onChange={(e) => {
                  const slugInput = document.getElementById('slug') as HTMLInputElement;
                  if (slugInput) {
                    slugInput.value = generateSlug(e.target.value);
                  }
                }}
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-semibold text-foreground mb-2">
                Company Slug
              </label>
              <div className="flex rounded-xl shadow-sm">
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  required
                  pattern="^[a-z0-9-]+$"
                  className="flex-1 block w-full px-4 py-3 border border-primary/20 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background transition-all duration-200 hover:border-primary/30"
                  placeholder="your-company"
                />
                <span className="inline-flex items-center px-3 rounded-r-xl border border-l-0 border-primary/20 bg-primary/5 text-muted text-sm font-mono">
                  (on sugary.dev)
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">
                This will be used in your feature URLs (e.g., sugary.dev/yourcompany/feature-name)
              </p>
            </div>

            <div>
              <GradientButton type="submit" disabled={isLoading} className="w-full" size="lg">
                {isLoading ? 'Setting up...' : 'Continue to Create Your First Feature →'}
              </GradientButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
