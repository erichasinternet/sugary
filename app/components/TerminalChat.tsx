'use client';

import { useMutation, useQuery } from 'convex/react';
import { useState, useRef, useEffect } from 'react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface TerminalChatProps {
  featureId: Id<'features'>;
  className?: string;
}

export default function TerminalChat({ featureId, className = '' }: TerminalChatProps) {
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useQuery(api.chat.getFeatureMessages, { featureId });
  const sendMessage = useMutation(api.chat.sendMessage);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await sendMessage({
        featureId,
        authorName: name.trim(),
        message: input.trim(),
      });
      setInput('');
    } catch (err) {
      // Silent fail
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (messages === undefined) {
    return (
      <div
        className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-primary/10 p-6 ${className}`}
      >
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-xl ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-4 py-3 border-b border-primary/10 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
          <h3 className="font-mono text-sm font-semibold text-foreground">Live Chat</h3>
          <div className="ml-auto text-xs text-muted font-mono">
            {messages.length} {messages.length === 1 ? 'message' : 'messages'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 && (
          <div className="text-center py-8 text-muted">
            <div className="text-2xl mb-2">🚀</div>
            <div className="font-mono text-sm">No messages yet</div>
            <div className="font-mono text-xs mt-1 opacity-60">
              Be the first to share your thoughts
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg._id} className="group">
            <div className="flex items-start gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                  msg.isFounder
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white ring-2 ring-yellow-300/50'
                    : 'bg-gradient-to-r from-primary/80 to-secondary/80 text-white'
                }`}
              >
                {msg.isFounder ? '★' : msg.authorName[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`font-mono text-sm font-medium ${
                      msg.isFounder
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent'
                        : 'text-foreground'
                    }`}
                  >
                    {msg.authorName}
                    {msg.isFounder && (
                      <span className="ml-1 text-xs bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-1.5 py-0.5 rounded-full font-sans">
                        Founder
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
                <div className="font-mono text-sm text-foreground leading-relaxed break-words bg-gradient-to-r from-primary/5 to-secondary/5 px-3 py-2 rounded-lg border border-primary/10">
                  {msg.message}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-primary/10 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-b-2xl">
        <form onSubmit={handleSubmit} className="space-y-3">
          {!hasJoined ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                className="flex-1 font-mono text-sm px-3 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background/50 backdrop-blur-sm"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  if (name.trim()) {
                    setHasJoined(true);
                  }
                }}
                disabled={!name.trim()}
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-mono text-sm rounded-lg font-medium disabled:opacity-50 hover:shadow-md transition-all duration-200"
              >
                Join
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-background/50 rounded-lg border border-primary/20">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
                <span className="font-mono text-sm font-medium text-foreground">{name}</span>
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={200}
                disabled={isSubmitting}
                className="flex-1 font-mono text-sm px-3 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background/50 backdrop-blur-sm"
                placeholder="Type your message..."
                autoFocus
              />
              <button
                type="submit"
                disabled={!input.trim() || isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-mono text-sm rounded-lg font-medium disabled:opacity-50 hover:shadow-md transition-all duration-200"
              >
                {isSubmitting ? '...' : 'Send'}
              </button>
            </div>
          )}

          <div className="flex justify-between font-mono text-xs text-muted">
            <span>Messages are public • Be respectful</span>
            {hasJoined && <span>{input.length}/200</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
