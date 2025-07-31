'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';
import Link from 'next/link';
import { api } from '@/convex/_generated/api';

export function DashboardNav() {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.getCurrentUser);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-primary/10 bg-white/95 dark:bg-slate-900/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-full"
                style={{ background: 'var(--gradient-primary)' }}
              ></div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Sugary
              </span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              <Link
                href="/dashboard"
                className="text-muted hover:text-foreground hover:bg-primary/5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/features/new"
                className="text-muted hover:text-foreground hover:bg-primary/5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                New Feature
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">
                  {(user?.name || user?.email)?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {user?.name || user?.email}
              </span>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-muted hover:text-foreground hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent hover:border-red-200 dark:hover:border-red-800"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
