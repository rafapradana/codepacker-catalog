import { IconTrendingUp, IconUsers, IconFolder, IconTag, IconCode, IconStack, IconSchool } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DashboardStats } from "@/lib/dashboard-stats"

interface DashboardStatsCardsProps {
  stats: DashboardStats;
}

export function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <IconUsers className="h-5 w-5 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            {stats.totalStudents.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="pt-0">
          <p className="text-sm text-muted-foreground">
            Registered students in the system
          </p>
        </CardFooter>
      </Card>
      
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-chart-1/5 to-chart-1/10 dark:from-chart-1/10 dark:to-chart-1/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-chart-1/10 p-2">
              <IconFolder className="h-5 w-5 text-chart-1" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            {stats.totalProjects.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="pt-0">
          <p className="text-sm text-muted-foreground">
            Student projects in catalog
          </p>
        </CardFooter>
      </Card>
      
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-chart-2/5 to-chart-2/10 dark:from-chart-2/10 dark:to-chart-2/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-chart-2/10 p-2">
              <IconTag className="h-5 w-5 text-chart-2" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            {stats.totalCategories.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="pt-0">
          <p className="text-sm text-muted-foreground">
            Project categories available
          </p>
        </CardFooter>
      </Card>
      
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-chart-3/5 to-chart-3/10 dark:from-chart-3/10 dark:to-chart-3/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-chart-3/10 p-2">
              <IconStack className="h-5 w-5 text-chart-3" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            {stats.totalTechstacks.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="pt-0">
          <p className="text-sm text-muted-foreground">
            Technology stacks listed
          </p>
        </CardFooter>
      </Card>
      
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-chart-4/5 to-chart-4/10 dark:from-chart-4/10 dark:to-chart-4/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-chart-4/10 p-2">
              <IconCode className="h-5 w-5 text-chart-4" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            {stats.totalSkills.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="pt-0">
          <p className="text-sm text-muted-foreground">
            Skills available to track
          </p>
        </CardFooter>
      </Card>
      
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-chart-5/5 to-chart-5/10 dark:from-chart-5/10 dark:to-chart-5/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-chart-5/10 p-2">
              <IconSchool className="h-5 w-5 text-chart-5" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            {stats.totalClasses.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="pt-0">
          <p className="text-sm text-muted-foreground">
            Student classes managed
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}