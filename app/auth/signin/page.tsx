'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SugaryLogo from '../../components/SugaryLogo';
import GradientButton from '../../components/GradientButton';

type AuthMethod = 'password' | 'otp';
type Step = 'method' | 'password' | 'otp-code';

export default function SignIn() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<Step>('method');
  const [email, setEmail] = useState('');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('password');

  const handleMethodSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const emailValue = formData.get('email') as string;
    const method = formData.get('method') as AuthMethod;

    setEmail(emailValue);
    setAuthMethod(method);

    if (method === 'otp') {
      try {
        await signIn('resend-otp', { email: emailValue });
        setStep('otp-code');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to send verification code');
      }
    } else {
      setStep('password');
    }

    setIsLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;

    try {
      await signIn('password', { email, password, flow: 'signIn' });
      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const code = formData.get('code') as string;

    try {
      await signIn('resend-otp', { email, code });
      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Invalid verification code');
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
          <h2 className="text-3xl font-bold mb-2 text-foreground">Welcome back</h2>
          <p className="text-muted mb-8">
            Don't have an account?{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Sign up for free
            </Link>
          </p>
        </div>

        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 shadow-xl">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {step === 'method' && (
            <form className="space-y-6" onSubmit={handleMethodSubmit}>
              <div className="space-y-5">
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
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    How would you like to sign in?
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-primary/20 rounded-xl hover:border-primary/30 transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="method"
                        value="password"
                        defaultChecked
                        className="mr-3 text-primary focus:ring-primary/50"
                      />
                      <div>
                        <div className="font-medium text-foreground">Password</div>
                        <div className="text-sm text-muted">I have a password for this account</div>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border border-primary/20 rounded-xl hover:border-primary/30 transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="method"
                        value="otp"
                        className="mr-3 text-primary focus:ring-primary/50"
                      />
                      <div>
                        <div className="font-medium text-foreground">Email verification code</div>
                        <div className="text-sm text-muted">Send me a code to sign in</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <GradientButton type="submit" disabled={isLoading} className="w-full" size="lg">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Continue...
                  </span>
                ) : (
                  'Continue'
                )}
              </GradientButton>
            </form>
          )}

          {step === 'password' && (
            <form className="space-y-6" onSubmit={handlePasswordSubmit}>
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
                    placeholder="Your secure password"
                  />
                  <p className="text-sm text-muted mt-2">
                    Forgot your password?{' '}
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await signIn('resend-otp', { email });
                          setStep('otp-code');
                        } catch (error) {
                          setError('Failed to send verification code');
                        }
                      }}
                      className="text-primary hover:text-primary-dark transition-colors"
                    >
                      Use email verification instead
                    </button>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('method')}
                  className="px-4 py-2 text-muted hover:text-foreground transition-colors"
                >
                  ← Back
                </button>
                <GradientButton type="submit" disabled={isLoading} className="flex-1" size="lg">
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Signing you in...
                    </span>
                  ) : (
                    'Sign in to Dashboard'
                  )}
                </GradientButton>
              </div>
            </form>
          )}

          {step === 'otp-code' && (
            <form className="space-y-6" onSubmit={handleOTPSubmit}>
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
                  onClick={() => setStep('method')}
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
                    'Verify & Sign In'
                  )}
                </GradientButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
