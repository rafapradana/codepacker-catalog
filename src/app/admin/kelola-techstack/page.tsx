import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TechStacksDataTable } from "@/components/techstacks-data-table"
import { getTechStacks } from "@/lib/techstacks"

export const dynamic = 'force-dynamic'

export default async function KelolaTechStackPage() {
  const techstacks = await getTechStacks();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1 p-6">
          <TechStacksDataTable data={techstacks} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}