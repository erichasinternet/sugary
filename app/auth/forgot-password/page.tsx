'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SugaryLogo from '../../components/SugaryLogo';
import GradientButton from '../../components/GradientButton';

type Step = 'email' | 'verify-code' | 'new-password' | 'success';

export default function ForgotPassword() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const emailValue = formData.get('email') as string;
    setEmail(emailValue);

    try {
      // Send password reset code using FormData pattern
      await signIn('password', formData);
      setStep('verify-code');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send reset code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const code = formData.get('code') as string;

    try {
      // Store the code for the final step
      setVerificationCode(code);
      setStep('new-password');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Invalid reset code');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const password = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Use FormData pattern for reset-verification
      await signIn('password', formData);
      setStep('success');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to reset password');
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
          <h2 className="text-3xl font-bold mb-2 text-foreground">Reset your password</h2>
          <p className="text-muted mb-8">
            Remember your password?{' '}
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

          {step === 'email' && (
            <form className="space-y-6" onSubmit={handleEmailSubmit}>
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
                  <p className="text-sm text-muted mt-2">
                    We'll send you a code to reset your password
                  </p>
                </div>
              </div>

              <input name="flow" type="hidden" value="reset" />

              <GradientButton type="submit" disabled={isLoading} className="w-full" size="lg">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Sending reset code...
                  </span>
                ) : (
                  'Send Reset Code'
                )}
              </GradientButton>
            </form>
          )}

          {step === 'verify-code' && (
            <form className="space-y-6" onSubmit={handleCodeVerification}>
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
                    Reset Code
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
                    Check your email for the 8-digit reset code
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('email')}
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
                    'Verify Code'
                  )}
                </GradientButton>
              </div>
            </form>
          )}

          {step === 'new-password' && (
            <form className="space-y-6" onSubmit={handlePasswordReset}>
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    ✅ Code Verified!
                  </h3>
                  <p className="text-muted">
                    Now set your new password
                  </p>
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
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    className="block w-full px-4 py-3 border border-primary/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background transition-all duration-200 hover:border-primary/30"
                    placeholder="Choose a secure password"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-foreground mb-2"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="block w-full px-4 py-3 border border-primary/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background transition-all duration-200 hover:border-primary/30"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <input name="code" type="hidden" value={verificationCode} />
              <input name="email" type="hidden" value={email} />
              <input name="flow" type="hidden" value="reset-verification" />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('verify-code')}
                  className="px-4 py-2 text-muted hover:text-foreground transition-colors"
                >
                  ← Back
                </button>
                <GradientButton type="submit" disabled={isLoading} className="flex-1" size="lg">
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Resetting password...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </GradientButton>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  🎉 Password Reset Successfully!
                </h3>
                <p className="text-muted mb-6">
                  Your password has been updated. You can now sign in with your new password.
                </p>
              </div>

              <GradientButton
                onClick={() => router.push('/auth/signin')}
                className="w-full"
                size="lg"
              >
                Continue to Sign In
              </GradientButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}