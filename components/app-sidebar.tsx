"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Home,
  MapPin,
  Calendar,
  SquareTerminal,
  Users,
  BarChart3,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  navInsights: [
    {
      title: "Dashboard",
      url: "/",
      icon: BarChart3,
    },
  ],

  navManagement: [
    {
      title: "Destinations",
      url: "/destinations",
      icon: MapPin,
    },
    {
      title: "Bookings",
      url: "/bookings",
      icon: Calendar,
    },
  ],

  navContent: [
    {
      title: "Posts",
      url: "/posts",
      icon: BookOpen,
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
    },
  ],
 
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
         <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navInsights} groupTitle="Insights" />
        <NavMain items={data.navManagement} groupTitle="Management" />
        <NavMain items={data.navContent} groupTitle="Content" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
