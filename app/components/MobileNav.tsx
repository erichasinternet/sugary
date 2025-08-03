'use client';

import { useState } from 'react';
import Link from 'next/link';
import SugaryLogo from './SugaryLogo';
import GradientButton from './GradientButton';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-50 border-b border-primary/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          <SugaryLogo size="lg" />

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="text-muted hover:text-foreground transition-colors font-medium"
            >
              Sign In
            </Link>
            <GradientButton>
              <Link href="/auth/signup">Get Started</Link>
            </GradientButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <div className="w-5 h-5 flex flex-col justify-center space-y-1">
              <div className="w-5 h-0.5 bg-foreground"></div>
              <div className="w-5 h-0.5 bg-foreground"></div>
              <div className="w-5 h-0.5 bg-foreground"></div>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="sm:hidden border-t border-primary/10 glass">
            <div className="px-4 py-6 space-y-3">
              <Link
                href="/auth/signin"
                className="block w-full text-center py-3 px-6 text-foreground hover:text-primary transition-colors font-semibold border-2 border-primary/20 rounded-xl hover:border-primary/40 hover:bg-primary/5"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <GradientButton className="w-full" onClick={() => setIsOpen(false)}>
                <Link href="/auth/signup" className="block w-full">
                  Get Started
                </Link>
              </GradientButton>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}