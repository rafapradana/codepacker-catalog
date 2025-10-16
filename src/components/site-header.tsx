"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface SiteHeaderProps {
  title?: string;
  breadcrumbItems?: BreadcrumbItem[];
}

// Map of routes to their display names
const routeMap: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/kelola-kelas': 'Kelola Kelas',
  '/admin/kelola-siswa': 'Kelola Siswa',
  '/admin/kelola-project': 'Kelola Project',
  '/admin/kelola-kategori': 'Kelola Kategori',
  '/admin/kelola-techstack': 'Kelola Tech Stack',
  '/admin/kelola-skill': 'Kelola Skill',
}

export function SiteHeader({ title, breadcrumbItems }: SiteHeaderProps) {
  const pathname = usePathname()
  
  // Get the current page name from the route
  const currentPageName = routeMap[pathname] || title || "Dashboard"
  
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
      <div className="flex w-full items-center gap-2 px-6">
        <SidebarTrigger className="-ml-1 h-7 w-7" />
        <Separator
          orientation="vertical"
          className="mx-3 h-4"
        />
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-foreground">Panel Admin</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          
          {breadcrumbItems && breadcrumbItems.length > 0 ? (
            <>
              {breadcrumbItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {item.href ? (
                    <a 
                      href={item.href} 
                      className="font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className={`font-medium ${index === breadcrumbItems.length - 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {item.label}
                    </span>
                  )}
                  {index < breadcrumbItems.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </>
          ) : (
            <span className="font-medium text-muted-foreground">{currentPageName}</span>
          )}
        </div>
        
        <div className="ml-auto flex items-center gap-3">
          <ModeToggle />
          <Button variant="ghost" asChild size="sm" className="h-8 px-3 text-sm font-medium">
            <a
              href="/admin/loginadmin"
              className="text-muted-foreground hover:text-foreground"
            >
              Logout
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
