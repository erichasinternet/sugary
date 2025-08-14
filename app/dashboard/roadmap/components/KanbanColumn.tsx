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
    case 'todo':
      return 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50'
    case 'requested':
      return 'border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20'
    case 'in_progress':
      return 'border-yellow-200 dark:border-yellow-700 bg-yellow-50/50 dark:bg-yellow-900/20'
    case 'done':
      return 'border-green-200 dark:border-green-700 bg-green-50/50 dark:bg-green-900/20'
    case 'cancelled':
      return 'border-red-200 dark:border-red-700 bg-red-50/50 dark:bg-red-900/20'
    default:
      return 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50'
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
        rounded-xl border-2 transition-all duration-200 min-h-[400px]
        ${getColumnStyles(id)}
        ${isOver ? 'border-primary bg-primary/5' : ''}
      `}
    >
      <div className="p-4 border-b border-current/10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <Badge variant={getBadgeVariant(id)} className="text-xs">
            {count}
          </Badge>
        </div>
      </div>
      
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}