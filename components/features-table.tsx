'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { IconExternalLink, IconPlus } from "@tabler/icons-react"

export function FeaturesTable() {
  const features = useQuery(api.features.getMyFeatures)
  const company = useQuery(api.companies.getMyCompany)
  
  if (features === undefined || company === undefined) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Your Features</h3>
        </div>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscribers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                      <div className="h-3 bg-muted rounded w-48 animate-pulse"></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded w-8 animate-pulse"></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Your Features</h3>
        <Button size="sm" asChild>
          <Link href="/dashboard/features/new">
            <IconPlus className="w-4 h-4 mr-2" />
            New Feature
          </Link>
        </Button>
      </div>
      
      {features.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
              <IconPlus className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">No features yet</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first feature to start collecting feedback
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/features/new">
                Create Feature
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Subscribers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => (
                <TableRow key={feature._id} className="cursor-pointer hover:bg-primary/10 hover:border-primary/20 transition-colors border-l-4 border-l-transparent hover:border-l-primary/30" onClick={() => window.location.href = `/dashboard/features/${feature._id}`}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">
                        {feature.title}
                      </div>
                      <div className="text-sm text-muted-foreground font-mono">
                        sugary.dev/{company?.slug}/{feature.slug}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {feature.subscriberCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}