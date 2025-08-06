'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { useAction } from 'convex/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SugaryLogo from '../../components/SugaryLogo';
import GradientButton from '../../components/GradientButton';
import { api } from '@/convex/_generated/api';

type Step = 'info' | 'verify-email' | 'set-password';

export default function SignUp() {
  const { signIn } = useAuthActions();
  const handlePostSignup = useAction(api.users.handlePostSignup);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<Step>('info');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const emailValue = formData.get('email') as string;
    const nameValue = formData.get('name') as string;

    setEmail(emailValue);
    setName(nameValue);

    try {
      // Send verification email
      await signIn('resend-otp', { email: emailValue });
      setStep('verify-email');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const code = formData.get('code') as string;

    try {
      // Verify email with OTP but don't complete signup yet
      await signIn('resend-otp', { email, code });
      setStep('set-password');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSetup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;

    try {
      // Set password and complete signup
      const result = await signIn('password', { email, password, flow: 'signUp', name });
      
      // Get the user ID from the result to trigger post-signup actions
      if (result && 'userId' in result) {
        try {
          await handlePostSignup({ userId: result.userId });
        } catch (postSignupError) {
          console.warn('Post-signup actions failed:', postSignupError);
          // Don't block the user flow if trial creation fails
        }
      }
      
      router.push('/dashboard/onboarding');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--gradient-hero)' }}
    >
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mb-8">
            <SugaryLogo size="lg" />
          </div>
          <h2 className="text-3xl font-bold mb-2 text-foreground">Start building smarter</h2>
          <p className="text-muted mb-8">
            Already have an account?{' '}
            <Link
              href="/auth/signin"
              className="font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 shadow-xl">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {step === 'info' && (
            <form className="space-y-6" onSubmit={handleInfoSubmit}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                    Username
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="block w-full px-4 py-3 border border-primary/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background transition-all duration-200 hover:border-primary/30"
                    placeholder="Your username"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full px-4 py-3 border border-primary/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background transition-all duration-200 hover:border-primary/30"
                    placeholder="founder@startup.com"
                  />
                  <p className="text-sm text-muted mt-2">
                    We'll send you a verification code to confirm your email address
                  </p>
                </div>
              </div>

              <GradientButton type="submit" disabled={isLoading} className="w-full" size="lg">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Sending verification code...
                  </span>
                ) : (
                  'Send Verification Code'
                )}
              </GradientButton>
            </form>
          )}

          {step === 'verify-email' && (
            <form className="space-y-6" onSubmit={handleEmailVerification}>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-xl text-foreground">
                    {email}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="code"
                    className="block text-sm font-semibold text-foreground mb-2"
                  >
                    Verification Code
                  </label>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    maxLength={8}
                    className="block w-full px-4 py-3 border border-primary/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background transition-all duration-200 hover:border-primary/30 text-center text-lg font-mono tracking-widest"
                    placeholder="12345678"
                  />
                  <p className="text-sm text-muted mt-2">
                    Check your email for the 8-digit verification code
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('info')}
                  className="px-4 py-2 text-muted hover:text-foreground transition-colors"
                >
                  ← Back
                </button>
                <GradientButton type="submit" disabled={isLoading} className="flex-1" size="lg">
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Verifying...
                    </span>
                  ) : (
                    'Verify Email'
                  )}
                </GradientButton>
              </div>
            </form>
          )}

          {step === 'set-password' && (
            <form className="space-y-6" onSubmit={handlePasswordSetup}>
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    ✅ Email Verified!
                  </h3>
                  <p className="text-muted">
                    Now create a password for your account.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Username
                  </label>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-xl text-foreground">
                    {name}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-xl text-foreground">
                    {email}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-foreground mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full px-4 py-3 border border-primary/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background transition-all duration-200 hover:border-primary/30"
                    placeholder="Choose a secure password"
                  />
                  <p className="text-sm text-muted mt-2">
                    Choose a strong password for your account
                  </p>
                </div>
              </div>

              <GradientButton type="submit" disabled={isLoading} className="w-full" size="lg">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Creating account...
                  </span>
                ) : (
                  'Complete Account Setup'
                )}
              </GradientButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
