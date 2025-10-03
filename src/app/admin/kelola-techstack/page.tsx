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
        <SiteHeader title="Kelola Tech Stack" />
        <main className="@container/main flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <TechStacksDataTable data={techstacks} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}