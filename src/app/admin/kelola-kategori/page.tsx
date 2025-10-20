import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CategoriesDataTable } from "@/components/categories-data-table"
import { getCategories } from "@/lib/categories"

export const dynamic = 'force-dynamic'

export default async function KelolaKategoriPage() {
  const categories = await getCategories();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="@container/main flex flex-1 flex-col gap-6 p-6">
          <CategoriesDataTable data={categories} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}