'use client'

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Link from 'next/link'
import { IconWorld, IconPlus } from "@tabler/icons-react"

export function SiteHeader() {
  const company = useQuery(api.companies.getMyCompany)
  
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          {company && (
            <Button variant="ghost" asChild size="sm">
              <Link
                href={`https://sugary.dev/${company.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <IconWorld className="w-4 h-4" />
                <span className="hidden sm:inline">View Public Page</span>
              </Link>
            </Button>
          )}
          <Button asChild size="sm">
            <Link href="/dashboard/features/new" className="flex items-center gap-2">
              <IconPlus className="w-4 h-4" />
              <span className="hidden sm:inline">New Feature</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
