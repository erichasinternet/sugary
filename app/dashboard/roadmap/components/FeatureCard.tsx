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
    cursor-grab active:cursor-grabbing transition-all duration-200
    ${isDragging || isDraggableActive ? 'opacity-50 rotate-2 scale-105' : ''}
    ${isDragging ? 'shadow-2xl' : 'hover:shadow-md'}
  `

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cardClasses}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-foreground text-sm leading-snug flex-1 pr-2">
            {feature.title}
          </h4>
          <IconGripVertical className="h-4 w-4 text-muted flex-shrink-0" />
        </div>
        
        {feature.description && (
          <p className="text-xs text-muted line-clamp-2 mb-3">
            {feature.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted">
            <IconUsers className="h-3 w-3" />
            <span>{feature.subscriberCount}</span>
          </div>
          
          <code className="text-xs text-muted bg-muted/30 px-1.5 py-0.5 rounded">
            {feature.slug}
          </code>
        </div>
      </CardContent>
    </Card>
  )
}