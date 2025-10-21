import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { EnhancedStatsCards } from "@/components/dashboard/enhanced-stats-cards";
import { EnhancedRecentProjects } from "@/components/dashboard/enhanced-recent-projects";
import { EnhancedTopCategories } from "@/components/dashboard/enhanced-top-categories";
import { TopTechStacksChart } from "@/components/dashboard/top-techstacks-chart";
import { ClassPerformanceChart } from "@/components/dashboard/class-performance-chart";
import { getEnhancedDashboardStats } from "@/lib/enhanced-dashboard-stats";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function AdminDashboardPage() {
  const stats = await getEnhancedDashboardStats();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl space-y-6">
            {/* Enhanced Stats Cards */}
            <EnhancedStatsCards stats={stats} />
            
            {/* Main Content Grid - Responsive layout */}
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
              <EnhancedRecentProjects stats={stats} />
              <EnhancedTopCategories stats={stats} />
            </div>
            
            {/* Secondary Content Grid - Better responsive behavior */}
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
              <TopTechStacksChart stats={stats} />
              <ClassPerformanceChart stats={stats} />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
