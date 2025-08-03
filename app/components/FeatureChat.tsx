'use client';

import { useMutation, useQuery } from 'convex/react';
import { useState, useRef, useEffect } from 'react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface FeatureChatProps {
  featureId: Id<'features'>;
  featureTitle: string;
  className?: string;
}

export default function FeatureChat({ featureId, featureTitle, className = '' }: FeatureChatProps) {
  const [message, setMessage] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useQuery(api.chat.getFeatureMessages, { featureId });
  const recentCount = useQuery(api.chat.getRecentMessageCount, { featureId });
  const sendMessage = useMutation(api.chat.sendMessage);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !authorName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      await sendMessage({
        featureId,
        authorName: authorName.trim(),
        message: message.trim(),
      });
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (messages === undefined) {
    return (
      <div className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-primary/10 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-primary/20 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-muted/30 rounded w-full"></div>
            <div className="h-3 bg-muted/30 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-primary/10 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              💬 Community Discussion
              {recentCount && recentCount > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {recentCount} recent
                </span>
              )}
            </h3>
            <p className="text-sm text-muted">
              Share feedback and connect with others interested in {featureTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">💭</div>
            <p className="text-muted text-sm">Be the first to share your thoughts!</p>
            <p className="text-muted text-xs mt-1">Ask questions, share use cases, or give feedback</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                msg.isFounder 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white ring-2 ring-yellow-300'
                  : 'bg-gradient-to-r from-primary/80 to-secondary/80 text-white'
              }`}>
                {msg.isFounder ? '👑' : getInitials(msg.authorName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-medium ${
                    msg.isFounder ? 'text-yellow-600 dark:text-yellow-400' : 'text-foreground'
                  }`}>
                    {msg.authorName}
                    {msg.isFounder && (
                      <span className="ml-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-1.5 py-0.5 rounded-full">
                        Founder
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-muted">
                    {formatTimeAgo(msg.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed break-words">
                  {msg.message}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Form */}
      <div className="p-4 border-t border-primary/10">
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
              {error}
            </div>
          )}
          
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Your name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              maxLength={50}
              required
              className="flex-shrink-0 w-24 px-3 py-2 text-sm border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
            />
            <input
              type="text"
              placeholder="Share your thoughts..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              required
              className="flex-1 px-3 py-2 text-sm border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
            />
            <button
              type="submit"
              disabled={!message.trim() || !authorName.trim() || isSubmitting}
              className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white text-sm rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all duration-200"
            >
              {isSubmitting ? '...' : 'Send'}
            </button>
          </div>
          
          <div className="flex justify-between text-xs text-muted">
            <span>Messages are public and visible to everyone</span>
            <span>{message.length}/1000</span>
          </div>
        </form>
      </div>
    </div>
  );
}