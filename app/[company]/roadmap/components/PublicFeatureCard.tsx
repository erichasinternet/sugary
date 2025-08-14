'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { IconHeart, IconHeartFilled, IconUsers, IconMail, IconBell } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'

interface PublicFeatureCardProps {
  feature: {
    _id: Id<'features'>
    title: string
    description?: string
    status: string
    upvoteCount: number
    subscriberCount: number
    createdAt: number
    recentUpdate?: {
      _id: string
      title: string
      content: string
      sentAt: number
      recipientCount: number
    }
  }
  sessionId: string
}

export function PublicFeatureCard({ feature, sessionId }: PublicFeatureCardProps) {
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [email, setEmail] = useState('')
  const [notifyOnShip, setNotifyOnShip] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if user has already voted
  const userVote = useQuery(
    api.publicRoadmap.checkUserVote,
    sessionId ? {
      featureId: feature._id,
      sessionId,
      email: email || undefined,
    } : "skip"
  )

  const upvoteFeature = useMutation(api.publicRoadmap.upvoteFeature)
  const removeUpvote = useMutation(api.publicRoadmap.removeUpvote)

  const hasVoted = userVote?.hasVoted || false

  const handleUpvoteClick = () => {
    if (hasVoted) {
      // Remove upvote
      handleRemoveUpvote()
    } else {
      // Show email capture for new votes
      setShowEmailCapture(true)
    }
  }

  const handleRemoveUpvote = async () => {
    if (!sessionId) return
    
    try {
      await removeUpvote({
        featureId: feature._id,
        sessionId,
      })
    } catch (error) {
      console.error('Failed to remove upvote:', error)
    }
  }

  const handleSubmitVote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sessionId || isSubmitting) return

    setIsSubmitting(true)
    try {
      await upvoteFeature({
        featureId: feature._id,
        sessionId,
        voterEmail: email || undefined,
        notifyOnShip,
      })
      setShowEmailCapture(false)
      setEmail('')
    } catch (error) {
      console.error('Failed to upvote:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'done':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days}d ago`
    if (days < 30) return `${Math.floor(days / 7)}w ago`
    return `${Math.floor(days / 30)}mo ago`
  }

  if (showEmailCapture) {
    return (
      <div className="glass-card-subtle rounded-xl p-4 border border-primary/20">
        <form onSubmit={handleSubmitVote} className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground text-sm mb-2">
              Vote for "{feature.title}"
            </h4>
            <p className="text-xs text-muted mb-3">
              Get notified when this feature ships (optional)
            </p>
          </div>

          <div>
            <input
              type="email"
              placeholder="your@email.com (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background"
            />
          </div>

          {email && (
            <label className="flex items-center gap-2 text-xs text-muted">
              <input
                type="checkbox"
                checked={notifyOnShip}
                onChange={(e) => setNotifyOnShip(e.target.checked)}
                className="rounded"
              />
              Notify me when this ships
            </label>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'Voting...' : 'Vote'}
            </button>
            <button
              type="button"
              onClick={() => setShowEmailCapture(false)}
              className="px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="glass-card-subtle rounded-xl p-4 hover:glass-card transition-all duration-200">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground text-sm leading-tight flex-1 pr-2">
            {feature.title}
          </h3>
          <div className="flex items-center gap-2">
            <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(feature.status)}`}>
              {feature.status === 'in_progress' ? 'In Progress' : 
               feature.status === 'done' ? 'Done' :
               'Requested'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Recent Update */}
      {feature.recentUpdate && (
        <div className="mb-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <IconBell className="h-3 w-3 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-blue-900 dark:text-blue-100">
                  Update
                </span>
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  {formatRelativeTime(feature.recentUpdate.sentAt)}
                </span>
              </div>
              <p className="text-xs text-blue-800 dark:text-blue-200 font-medium mb-1">
                {feature.recentUpdate.title}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 line-clamp-2">
                {feature.recentUpdate.content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      {feature.description && (
        <p className="text-xs text-muted line-clamp-2 mb-3 leading-relaxed">
          {feature.description}
        </p>
      )}

      {/* Footer with metrics */}
      <div className="flex items-center justify-between text-xs text-muted mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <IconUsers className="h-3 w-3" />
            <span>{feature.subscriberCount} interested</span>
          </div>
        </div>
        <span>Added {formatRelativeTime(feature.createdAt)}</span>
      </div>

      {/* Upvote Section */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted">
          {feature.upvoteCount > 0 ? (
            <span>{feature.upvoteCount} {feature.upvoteCount === 1 ? 'person wants' : 'people want'} this</span>
          ) : (
            <span>Be the first to vote</span>
          )}
        </div>
        <button
          onClick={handleUpvoteClick}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
            ${hasVoted 
              ? 'bg-primary text-white border-primary hover:bg-primary-dark shadow-sm' 
              : 'bg-white border-gray-300 text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300'
            }
          `}
        >
          {hasVoted ? (
            <IconHeartFilled className="h-3 w-3" />
          ) : (
            <IconHeart className="h-3 w-3" />
          )}
          <span>{hasVoted ? 'Voted' : 'Upvote'}</span>
        </button>
      </div>
    </div>
  )
}