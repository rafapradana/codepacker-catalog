"use client"

import * as React from "react"
import {
  IconDashboard,
  IconSchool,
  IconTag,
  IconStack2,
  IconBrain,
} from "@tabler/icons-react"
import Image from "next/image"

import { NavMain } from "@/components/nav-main"
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

const data = {
  user: {
    name: "Administrator",
    email: "admin@smkn4malang.sch.id",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Kelola Kelas",
      url: "/admin/kelola-kelas",
      icon: IconSchool,
    },
    {
      title: "Kelola Kategori",
      url: "/admin/kelola-kategori",
      icon: IconTag,
    },
    {
      title: "Kelola Tech Stack",
      url: "/admin/kelola-techstack",
      icon: IconStack2,
    },
    {
      title: "Kelola Skill",
      url: "/admin/kelola-skill",
      icon: IconBrain,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin/dashboard">
                <Image 
                  src="/images/logos/codepacker-black.svg" 
                  alt="CodePacker Logo" 
                  width={20} 
                  height={20}
                  className="!size-5" 
                />
                <span className="text-base font-semibold">Panel Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
