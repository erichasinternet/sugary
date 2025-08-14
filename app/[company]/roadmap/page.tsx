'use client'

import { useQuery, useMutation } from 'convex/react'
import { useState, useEffect, useMemo } from 'react'
import { use } from 'react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import SugaryLogo from '../../components/SugaryLogo'
import { PublicFeatureCard } from './components/PublicFeatureCard'
import { IconSearch, IconShare } from '@tabler/icons-react'

const PUBLIC_COLUMNS = [
  { id: 'requested', title: 'Requested', description: 'Features we\'re considering' },
  { id: 'in_progress', title: 'In Progress', description: 'Currently being built' },
  { id: 'done', title: 'Done', description: 'Recently shipped features' },
]

// Generate a session ID for vote tracking
const getSessionId = () => {
  let sessionId = localStorage.getItem('sugary_session_id')
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    localStorage.setItem('sugary_session_id', sessionId)
  }
  return sessionId
}

export default function PublicRoadmap({
  params,
}: {
  params: Promise<{ company: string }>
}) {
  const { company: companySlug } = use(params)
  const [sessionId, setSessionId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  const roadmapData = useQuery(api.publicRoadmap.getPublicRoadmap, {
    companySlug,
  })

  // Initialize session ID on client side
  useEffect(() => {
    setSessionId(getSessionId())
  }, [])

  const groupedFeatures = useMemo(() => {
    if (!roadmapData?.features) return {}
    
    const filtered = roadmapData.features.filter(feature =>
      !searchQuery || 
      feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    return filtered.reduce((acc, feature) => {
      const status = feature.status
      if (!acc[status]) {
        acc[status] = []
      }
      acc[status].push(feature)
      return acc
    }, {} as Record<string, typeof filtered>)
  }, [roadmapData?.features, searchQuery])

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${roadmapData?.company.name} Roadmap`,
        text: `Check out what ${roadmapData?.company.name} is building next!`,
        url: window.location.href,
      })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      // You could add a toast notification here
    }
  }

  if (roadmapData === undefined) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted mt-4">Loading roadmap...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!roadmapData) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Company Not Found</h1>
            <p className="text-muted mb-8">The company you're looking for doesn't exist or hasn't published a roadmap yet.</p>
            <SugaryLogo href="/" className="justify-center" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-primary/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">{roadmapData.company.name}</h1>
              <p className="text-sm text-muted">Product Roadmap</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-primary transition-colors"
              >
                <IconShare className="h-4 w-4" />
                Share
              </button>
              <SugaryLogo href="/" size="sm" className="text-sm" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-primary/20 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
        </div>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PUBLIC_COLUMNS.map((column) => {
            const columnFeatures = groupedFeatures[column.id] || []
            
            return (
              <div key={column.id} className="glass-card rounded-2xl p-6 min-h-[400px]">
                {/* Column Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-foreground">{column.title}</h2>
                    <span className="text-sm text-muted bg-muted/20 px-2 py-1 rounded">
                      {columnFeatures.length}
                    </span>
                  </div>
                  <p className="text-xs text-muted">{column.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  {columnFeatures.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted">No features yet</p>
                    </div>
                  ) : (
                    columnFeatures.map((feature) => (
                      <PublicFeatureCard
                        key={feature._id}
                        feature={feature}
                        sessionId={sessionId}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-primary/10">
          <p className="text-sm text-muted mb-4">
            Want to build your own roadmap? 
          </p>
          <SugaryLogo href="/" className="justify-center" />
        </div>
      </div>
    </div>
  )
}