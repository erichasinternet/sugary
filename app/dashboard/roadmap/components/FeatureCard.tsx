'use client'

import { useDraggable } from '@dnd-kit/core'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconGripVertical, IconUsers, IconHeart, IconBell } from '@tabler/icons-react'
import type { Id } from '@/convex/_generated/dataModel'

interface FeatureCardProps {
  feature: {
    _id: Id<'features'>
    title: string
    slug: string
    description?: string
    subscriberCount: number
    upvoteCount: number
    status: string
    createdAt: number
    updatedAt: number
    recentUpdate: {
      _id: Id<'updates'>
      _creationTime: number
      title: string
      featureId: Id<'features'>
      content: string
      sentAt: number
      recipientCount: number
    } | null
  }
  isDragging?: boolean
}

export function FeatureCard({ feature, isDragging = false }: FeatureCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isDraggableActive,
  } = useDraggable({
    id: feature._id,
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  const cardClasses = `
    glass-card-subtle cursor-grab active:cursor-grabbing transition-all duration-200 
    hover:shadow-md border border-transparent hover:border-primary/20
    ${isDraggableActive ? 'opacity-0' : ''}
  `

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cardClasses}
      {...attributes}
      {...listeners}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground text-sm leading-tight mb-1 truncate">
              {feature.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-muted">
              <span>Created {formatRelativeTime(feature.createdAt)}</span>
              {feature.updatedAt !== feature.createdAt && (
                <>
                  <span>•</span>
                  <span>Updated {formatRelativeTime(feature.updatedAt)}</span>
                </>
              )}
            </div>
          </div>
          <IconGripVertical className="h-4 w-4 text-muted opacity-40 flex-shrink-0 ml-2" />
        </div>

        {/* Recent Update */}
        {feature.recentUpdate && (
          <div className="mb-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <IconBell className="h-3 w-3 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-blue-900 dark:text-blue-100">
                    Latest Update
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
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Sent to {feature.recentUpdate.recipientCount} subscribers
                </div>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Subscriber count */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-xs">
              <IconUsers className="h-3 w-3" />
              <span>{feature.subscriberCount}</span>
            </div>

            {/* Upvote count */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs">
              <IconHeart className="h-3 w-3" />
              <span>{feature.upvoteCount}</span>
            </div>
            
            {/* Public indicator */}
            {(feature.status === 'requested' || feature.status === 'in_progress' || feature.status === 'done') && (
              <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                Public
              </span>
            )}
          </div>
          
          {/* Feature slug */}
          <code className="text-xs text-muted font-mono truncate max-w-[80px]" title={feature.slug}>
            {feature.slug}
          </code>
        </div>
      </div>
    </div>
  )
}