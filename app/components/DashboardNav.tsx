'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import SugaryLogo from './SugaryLogo';

export function DashboardNav() {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.getCurrentUser);
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
  };

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: '📊' },
    { href: '/dashboard/features/new', label: 'New Feature', icon: '✨' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-primary/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <SugaryLogo href="/dashboard" size="md" />
            
            {/* Navigation items */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive(item.href)
                      ? 'text-primary bg-primary/10 shadow-sm'
                      : 'text-muted hover:text-foreground hover:bg-primary/5'
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs">{item.icon}</span>
                    {item.label}
                  </span>
                  {isActive(item.href) && (
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* User info */}
            <div className="hidden sm:flex items-center space-x-3 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-all duration-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-sm">
                <span className="text-sm font-bold text-white">
                  {(user?.name || user?.email)?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground max-w-32 truncate">
                {user?.name || user?.email}
              </span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-border"></div>

            {/* Sign out */}
            <button
              type="button"
              onClick={handleSignOut}
              className="group text-muted hover:text-red-600 dark:hover:text-red-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <span className="flex items-center gap-2">
                <span className="text-xs group-hover:rotate-12 transition-transform duration-200">👋</span>
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="sm:hidden border-t border-primary/10 px-4 py-2">
        <div className="flex space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center
                ${isActive(item.href)
                  ? 'text-primary bg-primary/10 shadow-sm'
                  : 'text-muted hover:text-foreground hover:bg-primary/5'
                }
              `}
            >
              <span className="text-xs">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
