import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AssessmentDataTable } from '@/components/assessment-data-table'

export default function PenilaianProjectPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <SiteHeader />
        <main className="@container/main flex flex-1 flex-col gap-6 p-6 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold">Penilaian Project</h1>
              <p className="text-muted-foreground">
                Kelola penilaian project siswa dengan berbagai kriteria assessment
              </p>
            </div>
            <AssessmentDataTable />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}