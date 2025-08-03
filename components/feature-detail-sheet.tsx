'use client'

import { useQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SendUpdateModal } from '@/app/components/SendUpdateModal'
import GradientButton from '@/app/components/GradientButton'

interface FeatureDetailSheetProps {
  featureId: Id<'features'> | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeatureDetailSheet({ featureId, open, onOpenChange }: FeatureDetailSheetProps) {
  const featureData = useQuery(
    api.features.getFeatureDetails,
    featureId ? { featureId } : "skip"
  )
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  if (!featureId || featureData === undefined) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!featureData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feature not found</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-muted-foreground">This feature could not be found.</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const { subscribers, company, ...feature } = featureData
  const featureUrl = `sugary.dev/${company.slug}/${feature.slug}`

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] p-0">
          <div className="p-6">
            <DialogHeader className="space-y-4">
              <div className="flex items-start justify-between pr-8">
                <div className="space-y-1">
                  <DialogTitle className="gradient-text text-xl">{feature.title}</DialogTitle>
                  <p className="text-sm text-muted-foreground font-mono">{featureUrl}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={
                      feature.status === 'completed' ? 'default' :
                      feature.status === 'in_progress' ? 'secondary' :
                      feature.status === 'cancelled' ? 'destructive' :
                      'outline'
                    }
                    className="capitalize"
                  >
                    {feature.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="glass-card overflow-hidden rounded-xl">
                <div className="p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 gradient-icon">
                        <span className="text-white text-xs">👥</span>
                      </div>
                    </div>
                    <div className="ml-3 w-0 flex-1">
                      <dl>
                        <dt className="text-xs font-medium text-muted-foreground truncate">
                          Interested Users
                        </dt>
                        <dd className="text-sm font-medium text-foreground">
                          {subscribers.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card overflow-hidden rounded-xl">
                <div className="p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 gradient-icon">
                        <span className="text-white text-xs">✅</span>
                      </div>
                    </div>
                    <div className="ml-3 w-0 flex-1">
                      <dl>
                        <dt className="text-xs font-medium text-muted-foreground truncate">
                          Subscribers
                        </dt>
                        <dd className="text-sm font-medium text-foreground">
                          {subscribers.filter((s) => s.confirmed).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card overflow-hidden rounded-xl">
                <div className="p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 gradient-icon">
                        <span className="text-white text-xs">🔗</span>
                      </div>
                    </div>
                    <div className="ml-3 w-0 flex-1">
                      <dl>
                        <dt className="text-xs font-medium text-muted-foreground truncate">
                          Share Link
                        </dt>
                        <dd className="text-xs font-medium text-foreground">
                          <button
                            onClick={() => navigator.clipboard.writeText(`https://${featureUrl}`)}
                            className="text-primary hover:text-primary-dark transition-colors"
                          >
                            Copy URL
                          </button>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Description */}
            {feature.description && (
              <div className="glass-card rounded-xl p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            )}

            {/* Action Button */}
            <div className="flex justify-center">
              <GradientButton
                onClick={() => {
                  setShowUpdateModal(true)
                  onOpenChange(false)
                }}
                size="sm"
              >
                Send Update to Subscribers
              </GradientButton>
            </div>

            {/* Subscribers List */}
            <div className="glass-card rounded-xl">
              <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-xl border-b border-primary/10">
                <h3 className="text-sm font-semibold text-foreground">
                  Subscribers ({subscribers.length})
                </h3>
              </div>

              {subscribers.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    No subscribers yet. Share your feature link to start collecting interest!
                  </p>
                  <div className="glass-card-subtle rounded-lg p-3 text-left">
                    <p className="text-xs font-semibold text-foreground mb-1">
                      Your feature link:
                    </p>
                    <code className="text-xs text-primary break-all font-mono">
                      https://{featureUrl}
                    </code>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 max-h-64 overflow-y-auto p-2">
                  {subscribers.map((subscriber) => (
                    <div key={subscriber._id} className="glass-card-subtle rounded-lg p-3 hover:glass-card transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center min-w-0 flex-1">
                          <div className="flex-shrink-0">
                            <div
                              className={`status-indicator ${
                                subscriber.confirmed ? 'status-completed' : 'status-in-progress'
                              }`}
                            ></div>
                          </div>
                          <div className="ml-3 min-w-0 flex-1">
                            <div className="text-xs font-medium text-foreground truncate">
                              {subscriber.email}
                            </div>
                            {subscriber.context && (
                              <div className="text-xs text-muted-foreground truncate">
                                "{subscriber.context}"
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Badge
                            variant={subscriber.confirmed ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {subscriber.confirmed ? 'Confirmed' : 'Pending'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(subscriber.subscribedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          </div>
        </DialogContent>
      </Dialog>

      <SendUpdateModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        featureId={featureId}
        featureTitle={feature.title}
        subscriberCount={subscribers.filter((s) => s.confirmed).length}
      />
    </>
  )
}