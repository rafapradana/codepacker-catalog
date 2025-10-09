"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import {
  IconDashboard,
  IconSchool,
  IconTag,
  IconStack2,
  IconBrain,
  IconUsers,
  IconFolder,
} from "@tabler/icons-react"
import Image from "next/image"
import { useTheme } from "next-themes"

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
  navGroups: [
    {
      title: "Dashboard",
      items: [
        {
          title: "Dashboard",
          url: "/admin/dashboard",
          icon: IconDashboard,
        },
      ],
    },
    {
      title: "Manajemen Data",
      items: [
        {
          title: "Kelola Kelas",
          url: "/admin/kelola-kelas",
          icon: IconSchool,
        },
        {
          title: "Kelola Siswa",
          url: "/admin/kelola-siswa",
          icon: IconUsers,
        },
        {
          title: "Kelola Project",
          url: "/admin/kelola-project",
          icon: IconFolder,
        },
      ],
    },
    {
      title: "Konfigurasi",
      items: [
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
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-3 data-[slot=sidebar-menu-button]:!h-auto"
            >
              <a href="/admin/dashboard" className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Image 
                    src={mounted && theme === 'dark' ? "/images/logos/codepacker-black.svg" : "/images/logos/codepacker-white.svg"}
                    alt="CodePacker Logo" 
                    width={20} 
                    height={20}
                    className="!size-5" 
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold">Panel Admin</span>
                  <span className="text-xs text-muted-foreground">CodePacker Catalog</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <NavMain groups={data.navGroups} />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
