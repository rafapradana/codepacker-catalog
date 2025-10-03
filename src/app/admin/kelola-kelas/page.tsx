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
        <SiteHeader title="Kelola Kelas" />
        <main className="@container/main flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <ClassesDataTable data={classes} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}