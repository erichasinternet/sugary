"use client";

import { use, useEffect, useState } from "react";
import { useMutation } from "convex/react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";

export default function ConfirmSubscription({ 
  params 
}: { 
  params: Promise<{ token: string }> 
}) {
  const { token } = use(params);
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading');
  const [error, setError] = useState("");
  
  const confirmSubscription = useMutation(api.subscribers.confirmSubscription);

  useEffect(() => {
    const confirm = async () => {
      try {
        await confirmSubscription({ token });
        setStatus('success');
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        if (error instanceof Error && error.message.includes("Invalid")) {
          setStatus('invalid');
        } else {
          setStatus('error');
        }
      }
    };

    confirm();
  }, [token, confirmSubscription]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Confirming your subscription...
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait while we verify your email.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            <div className="mb-4">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Subscription Confirmed!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Great! You're now confirmed to receive updates about this feature. 
              We'll email you as soon as there's progress to share.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>What's next?</strong> Keep an eye on your inbox for updates, 
                and feel free to reply to our emails with any additional feedback.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Visit Sugary
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            <div className="mb-4">
              <span className="text-4xl">🔗</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Invalid Link
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This confirmation link is invalid or has already been used. 
              If you're trying to subscribe to a feature, please use the original signup link.
            </p>
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Go to Sugary
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <div className="mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We couldn't confirm your subscription. Please try again or contact support.
          </p>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Go to Sugary
          </Link>
        </div>
      </div>
    </div>
  );
}