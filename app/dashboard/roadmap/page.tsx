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
      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold gradient-text">Roadmap</h1>
            <p className="text-muted mt-2">
              Manage your feature development pipeline with drag & drop
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {COLUMNS.map((column) => (
              <div key={column.id} className="glass-card rounded-xl p-4">
                <div className="h-8 bg-muted rounded w-20 animate-pulse mb-4"></div>
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-24 bg-muted rounded animate-pulse"></div>
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
    <div className="px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Roadmap</h1>
          <p className="text-muted mt-2">
            Manage your feature development pipeline with drag & drop
          </p>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
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