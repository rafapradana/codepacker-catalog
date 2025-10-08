import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ClassesDataTable } from "@/components/classes-data-table"
import { getClasses } from "@/lib/classes"

export default async function KelolaKelasPage() {
  const classes = await getClasses();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="@container/main flex flex-1 flex-col gap-6 p-6">
          <ClassesDataTable data={classes} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}