import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TechStacksDataTable } from "@/components/techstacks-data-table"
import { getTechStacks } from "@/lib/techstacks"

export default async function KelolaTechStackPage() {
  const techstacks = await getTechStacks();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="@container/main flex flex-1 flex-col gap-6 p-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Kelola Tech Stack</h1>
            <p className="text-sm text-muted-foreground">
              Kelola data tech stack project
            </p>
          </div>
          
          <TechStacksDataTable data={techstacks} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}