'use client'

import { useDraggable } from '@dnd-kit/core'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconGripVertical, IconUsers } from '@tabler/icons-react'

interface FeatureCardProps {
  feature: {
    _id: string
    title: string
    slug: string
    description?: string
    subscriberCount: number
    status: string
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
    ${isDragging || isDraggableActive ? 'opacity-50 rotate-1 scale-105 shadow-lg border-primary/30' : ''}
  `

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cardClasses}
      {...attributes}
      {...listeners}
    >
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-foreground text-sm leading-tight flex-1 pr-2">
            {feature.title}
          </h4>
          <IconGripVertical className="h-3 w-3 text-muted opacity-50 flex-shrink-0 mt-0.5" />
        </div>
        
        {feature.description && (
          <p className="text-xs text-muted line-clamp-2 mb-3 leading-normal">
            {feature.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted">
            <IconUsers className="h-3 w-3" />
            <span>{feature.subscriberCount}</span>
          </div>
          
          <code className="text-muted font-mono">
            {feature.slug}
          </code>
        </div>
      </div>
    </div>
  )
}