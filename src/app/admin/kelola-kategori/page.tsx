import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CategoriesDataTable } from "@/components/categories-data-table"
import { getCategories } from "@/lib/categories"

export default async function KelolaKategoriPage() {
  const categories = await getCategories();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader title="Kelola Kategori" />
        <main className="@container/main flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <CategoriesDataTable data={categories} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}