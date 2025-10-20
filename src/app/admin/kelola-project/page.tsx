import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ProjectsDataTable } from '@/components/projects-data-table'

export const dynamic = 'force-dynamic'

export default function KelolaProjectPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <SiteHeader />
        <main className="@container/main flex flex-1 flex-col gap-6 p-6 overflow-y-auto">
          <ProjectsDataTable />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}