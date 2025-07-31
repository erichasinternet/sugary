'use client';

import { useMutation } from 'convex/react';
import { useState } from 'react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

interface SendUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureId: Id<'features'>;
  featureTitle: string;
  subscriberCount: number;
}

export function SendUpdateModal({
  isOpen,
  onClose,
  featureId,
  featureTitle,
  subscriberCount,
}: SendUpdateModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const sendFeatureUpdate = useMutation(api.features.sendFeatureUpdate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await sendFeatureUpdate({
        featureId,
        title,
        content,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setTitle('');
        setContent('');
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setTitle('');
      setContent('');
      setError('');
      setSuccess(false);
    }
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md text-center">
          <div className="mb-4">
            <span className="text-4xl">📧</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Update Sent!</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Your update has been sent to all confirmed subscribers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Send Update</h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Send an update about <strong>{featureTitle}</strong> to {subscriberCount} confirmed
              subscribers.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="update-title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Update Title
              </label>
              <input
                type="text"
                id="update-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Development Started, Beta Available, Feature Complete"
              />
            </div>

            <div>
              <label
                htmlFor="update-content"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Update Content
              </label>
              <textarea
                id="update-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Share your progress, timeline updates, or ask for feedback from your subscribers..."
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                This will be sent via email to all confirmed subscribers.
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={isLoading || !title.trim() || !content.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </span>
              ) : (
                `Send to ${subscriberCount} subscribers`
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
