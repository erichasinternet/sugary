"use client"

import {
  type Icon,
  IconExternalLink,
} from "@tabler/icons-react"
import Link from "next/link"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: Icon
    external?: boolean
  }[]
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              {item.external ? (
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:text-primary transition-all duration-200"
                >
                  <item.icon />
                  <span>{item.name}</span>
                </a>
              ) : (
                <Link href={item.url} className="hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:text-primary transition-all duration-200">
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
