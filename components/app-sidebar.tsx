"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconPlus,
  IconSettings,
  IconUsers,
  IconWorld,
  IconStar,
  IconEye,
} from "@tabler/icons-react"
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const company = useQuery(api.companies.getMyCompany)
  const currentUser = useQuery(api.users.getCurrentUser)
  
  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: "Features",
        url: "/dashboard/features",
        icon: IconStar,
        items: [
          {
            title: "All Features",
            url: "/dashboard/features",
          },
          {
            title: "New Feature",
            url: "/dashboard/features/new",
          },
        ],
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: IconChartBar,
      },
    ],
    quickActions: [
      {
        name: "New Feature",
        url: "/dashboard/features/new",
        icon: IconPlus,
      },
      {
        name: "View Public Page",
        url: company ? `https://sugary.dev/${company.slug}` : "#",
        icon: IconWorld,
        external: true,
      },
      {
        name: "Preview Mode",
        url: "/dashboard/preview",
        icon: IconEye,
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: IconSettings,
      },
      {
        title: "Support",
        url: "/dashboard/support",
        icon: IconHelp,
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">S</span>
                </div>
                <span className="text-base font-semibold">Sugary</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.quickActions} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {currentUser && (
          <NavUser user={{
            name: currentUser.name || currentUser.email?.split('@')[0] || 'User',
            email: currentUser.email || 'user@sugary.dev',
            avatar: '/avatars/user.jpg'
          }} />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
