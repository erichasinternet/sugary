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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="glass-card-elevated rounded-2xl p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto gradient-icon rounded-full">
              <span className="text-2xl">📧</span>
            </div>
          </div>
          <h3 className="text-xl font-bold gradient-text mb-3">Update Sent!</h3>
          <p className="text-muted-foreground">
            Your update has been sent to all confirmed subscribers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card-elevated rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-2xl border-b border-primary/10">
          <h2 className="text-xl font-bold text-primary">Send Update</h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-lg opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:pointer-events-none bg-background/50 hover:bg-background p-2"
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-4 h-4"
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
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Send an update about <span className="font-semibold text-foreground">{featureTitle}</span> to {subscriberCount} confirmed
              subscribers.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="update-title"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Update Title
              </label>
              <input
                type="text"
                id="update-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 border border-primary/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background transition-all duration-200 hover:border-primary/30"
                placeholder="e.g., Development Started, Beta Available, Feature Complete"
              />
            </div>

            <div>
              <label
                htmlFor="update-content"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Update Content
              </label>
              <textarea
                id="update-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={6}
                className="w-full px-4 py-3 border border-primary/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background transition-all duration-200 hover:border-primary/30 resize-none"
                placeholder="Share your progress, timeline updates, or ask for feedback from your subscribers..."
              />
              <p className="mt-2 text-sm text-muted-foreground">
                This will be sent via email to all confirmed subscribers.
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={isLoading || !title.trim() || !content.trim()}
              className="flex-1 brand-button py-3 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="px-6 py-3 border border-primary/20 rounded-xl text-foreground hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
