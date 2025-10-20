import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { EnhancedStatsCards } from "@/components/dashboard/enhanced-stats-cards";
import { EnhancedRecentProjects } from "@/components/dashboard/enhanced-recent-projects";
import { EnhancedTopCategories } from "@/components/dashboard/enhanced-top-categories";
import { TopTechStacksChart } from "@/components/dashboard/top-techstacks-chart";
import { ClassPerformanceChart } from "@/components/dashboard/class-performance-chart";
import { MonthlyTrendsChart } from "@/components/dashboard/monthly-trends-chart";
import { getEnhancedDashboardStats } from "@/lib/enhanced-dashboard-stats";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function AdminDashboardPage() {
  const stats = await getEnhancedDashboardStats();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="grid flex-1 items-start gap-6 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-[90rem] flex-1 auto-rows-max gap-6">
            <div className="flex items-center gap-4">
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Dashboard Admin
              </h1>
            </div>
            
            {/* Enhanced Stats Cards */}
            <EnhancedStatsCards stats={stats} />
            
            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              <EnhancedRecentProjects stats={stats} />
              <EnhancedTopCategories stats={stats} />
            </div>
            
            {/* Secondary Content Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              <TopTechStacksChart stats={stats} />
              <ClassPerformanceChart stats={stats} />
            </div>
            
            {/* Monthly Trends - Full Width */}
            <MonthlyTrendsChart stats={stats} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
