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
        <SiteHeader />
        <main className="@container/main flex flex-1 flex-col gap-6 p-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Kelola Kategori</h1>
            <p className="text-sm text-muted-foreground">
              Kelola kategori project siswa
            </p>
          </div>
          
          <CategoriesDataTable data={categories} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}