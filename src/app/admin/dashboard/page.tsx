import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardStatsCards } from "@/components/dashboard-stats-cards"
import { RecentProjectsTable } from "@/components/recent-projects-table"
import { TopCategoriesChart } from "@/components/top-categories-chart"
import { getDashboardStats } from "@/lib/dashboard-stats"

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="@container/main flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <DashboardStatsCards stats={stats} />
          
          <div className="grid grid-cols-1 gap-4 lg:gap-6 @4xl/main:grid-cols-2">
            <RecentProjectsTable projects={stats.recentProjects} />
            <TopCategoriesChart categories={stats.topCategories} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
