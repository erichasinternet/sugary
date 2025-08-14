'use client'

import { useQuery, useMutation } from 'convex/react'
import { useState, useMemo } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconExternalLink, IconShare } from '@tabler/icons-react'
import { KanbanColumn } from './components/KanbanColumn'
import { FeatureCard } from './components/FeatureCard'

const COLUMNS = [
  { id: 'cancelled', title: 'Cancelled', status: 'cancelled' as const },
  { id: 'todo', title: 'To Do', status: 'todo' as const },
  { id: 'requested', title: 'Requested', status: 'requested' as const },
  { id: 'in_progress', title: 'In Progress', status: 'in_progress' as const },
  { id: 'done', title: 'Done', status: 'done' as const },
]

export default function RoadmapPage() {
  const features = useQuery(api.features.getMyFeatures)
  const company = useQuery(api.companies.getMyCompany)
  const updateFeatureStatus = useMutation(api.features.updateFeatureStatus)
  const [activeFeature, setActiveFeature] = useState<any>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const groupedFeatures = useMemo(() => {
    if (!features) return {}
    
    return features.reduce((acc, feature) => {
      const status = feature.status
      if (!acc[status]) {
        acc[status] = []
      }
      acc[status].push(feature)
      return acc
    }, {} as Record<string, typeof features>)
  }, [features])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const feature = features?.find(f => f._id === active.id)
    setActiveFeature(feature)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveFeature(null)

    console.log('Drag ended:', { active: active.id, over: over?.id })

    if (!over) {
      console.log('No drop target')
      return
    }

    const featureId = active.id as Id<'features'>
    const newStatus = over.id as string

    // Check if we're dropping on a column
    const isValidStatus = COLUMNS.some(col => col.id === newStatus)
    if (!isValidStatus) {
      console.log('Invalid status:', newStatus)
      return
    }

    // Don't update if dropping on the same status
    const currentFeature = features?.find(f => f._id === featureId)
    if (currentFeature?.status === newStatus) {
      console.log('Same status, no update needed')
      return
    }

    console.log('Updating feature status:', { featureId, newStatus })

    try {
      await updateFeatureStatus({
        featureId,
        status: newStatus as any,
      })
      console.log('Status updated successfully')
    } catch (error) {
      console.error('Failed to update feature status:', error)
    }
  }

  if (features === undefined) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* Header */}
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Roadmap</h1>
              <p className="text-sm text-muted mt-1">
                Drag features between columns to update their status
              </p>
            </div>
            <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
          </div>
        </div>

        {/* Loading Kanban */}
        <div className="px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {COLUMNS.map((column) => (
              <div key={column.id} className="glass-card-subtle rounded-xl p-4 min-h-[400px]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                  <div className="ml-auto w-6 h-5 bg-muted rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="glass-card-subtle rounded-lg p-3 h-20">
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
                        <div className="h-2 bg-muted rounded w-1/2 animate-pulse"></div>
                        <div className="flex justify-between items-center">
                          <div className="h-4 w-8 bg-muted rounded-full animate-pulse"></div>
                          <div className="h-3 w-12 bg-muted rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Roadmap</h1>
            <p className="text-sm text-muted mt-1">
              Drag features between columns to update their status
            </p>
          </div>
          <div className="flex items-center gap-3">
            {company && (
              <a
                href={`/${company.slug}/roadmap`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 text-sm text-primary hover:text-primary-dark bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
              >
                <IconExternalLink className="h-4 w-4" />
                View Public Roadmap
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="px-4 lg:px-6">
        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {COLUMNS.map((column) => {
              const columnFeatures = groupedFeatures[column.status] || []
              
              return (
                <KanbanColumn
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  count={columnFeatures.length}
                >
                  <div className="space-y-3">
                    {columnFeatures.map((feature) => (
                      <FeatureCard
                        key={feature._id}
                        feature={feature}
                      />
                    ))}
                  </div>
                </KanbanColumn>
              )
            })}
          </div>

          <DragOverlay>
            {activeFeature ? (
              <FeatureCard feature={activeFeature} isDragging />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}