import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ProjectsDataTable } from '@/components/projects-data-table'

export default function KelolaProjectPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="@container/main flex flex-1 flex-col gap-6 p-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Kelola Project Siswa</h1>
            <p className="text-sm text-muted-foreground">
              Kelola data project siswa dengan lengkap
            </p>
          </div>
          
          <ProjectsDataTable />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}