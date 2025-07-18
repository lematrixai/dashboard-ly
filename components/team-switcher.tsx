"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {

} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu> 
      <SidebarMenuItem>
        
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Image src="/logo-sm.png" alt="logo" width={32} height={32} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Luxury</span>
                <span className="truncate text-xs">Dashboard</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
        
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
