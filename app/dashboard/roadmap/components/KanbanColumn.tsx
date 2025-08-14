'use client'

import { useDroppable } from '@dnd-kit/core'
import { Badge } from "@/components/ui/badge"

interface KanbanColumnProps {
  id: string
  title: string
  count: number
  children: React.ReactNode
}

const getColumnStyles = (id: string) => {
  switch (id) {
    case 'cancelled':
      return 'bg-gradient-to-br from-red-50/80 to-red-100/60 dark:from-red-950/40 dark:to-red-900/30 border-red-200/60 dark:border-red-800/50'
    case 'todo':
      return 'bg-gradient-to-br from-gray-50/80 to-gray-100/60 dark:from-gray-900/40 dark:to-gray-800/30 border-gray-200/60 dark:border-gray-700/50'
    case 'requested':
      return 'bg-gradient-to-br from-blue-50/80 to-blue-100/60 dark:from-blue-950/40 dark:to-blue-900/30 border-blue-200/60 dark:border-blue-800/50'
    case 'in_progress':
      return 'bg-gradient-to-br from-yellow-50/80 to-yellow-100/60 dark:from-yellow-950/40 dark:to-yellow-900/30 border-yellow-200/60 dark:border-yellow-800/50'
    case 'done':
      return 'bg-gradient-to-br from-green-50/80 to-green-100/60 dark:from-green-950/40 dark:to-green-900/30 border-green-200/60 dark:border-green-800/50'
    default:
      return 'bg-gradient-to-br from-gray-50/80 to-gray-100/60 dark:from-gray-900/40 dark:to-gray-800/30 border-gray-200/60 dark:border-gray-700/50'
  }
}

const getBadgeVariant = (id: string) => {
  switch (id) {
    case 'todo':
      return 'outline' as const
    case 'requested':
      return 'secondary' as const
    case 'in_progress':
      return 'secondary' as const
    case 'done':
      return 'default' as const
    case 'cancelled':
      return 'destructive' as const
    default:
      return 'outline' as const
  }
}


export function KanbanColumn({ id, title, count, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        glass-card-subtle rounded-xl border transition-all duration-200 min-h-[400px]
        ${getColumnStyles(id)}
        ${isOver ? '!border-primary !bg-primary/10 ring-4 ring-primary/40 shadow-xl !shadow-primary/20' : 'border-transparent'}
      `}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground text-sm">{title}</h3>
          <Badge 
            variant={getBadgeVariant(id)} 
            className="text-xs px-1.5 py-0.5"
          >
            {count}
          </Badge>
        </div>
      </div>
      
      {/* Column Content */}
      <div className="p-3">
        {count === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-muted">
              {id === 'cancelled' ? 'No cancelled features' :
               id === 'todo' ? 'No pending features' :
               id === 'requested' ? 'No requested features' :
               id === 'in_progress' ? 'No features in progress' :
               'No completed features'}
            </p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}