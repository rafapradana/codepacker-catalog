import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { FeedbackDataTable } from "@/components/feedback-data-table"

export default async function FeedbackManagementPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="@container/main flex flex-1 flex-col gap-6 p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Feedback Management</h1>
              <p className="text-muted-foreground">
                Kelola feedback dari siswa dan ubah status tanggapan.
              </p>
            </div>
            <FeedbackDataTable />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}