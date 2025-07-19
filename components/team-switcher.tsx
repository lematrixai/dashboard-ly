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

export function TeamSwitcher() {



  return (
    <SidebarMenu> 
      <SidebarMenuItem>
        
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <Image src="/logo-sm.png" alt="logo" width={32} height={32} className="w-[32px] h-[32px] object-contain" />
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
