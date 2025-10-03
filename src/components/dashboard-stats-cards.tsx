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
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-3 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs">Total Students</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {stats.totalStudents.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs">
              <IconUsers className="size-3" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs pt-0">
          <div className="line-clamp-1 flex gap-1 font-medium">
            Registered students <IconUsers className="size-3" />
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs">Total Projects</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {stats.totalProjects.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs">
              <IconFolder className="size-3" />
              Published
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs pt-0">
          <div className="line-clamp-1 flex gap-1 font-medium">
            Student projects <IconFolder className="size-3" />
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs">Categories</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {stats.totalCategories.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs">
              <IconTag className="size-3" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs pt-0">
          <div className="line-clamp-1 flex gap-1 font-medium">
            Project categories <IconTag className="size-3" />
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs">Tech Stacks</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {stats.totalTechstacks.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs">
              <IconStack className="size-3" />
              Available
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs pt-0">
          <div className="line-clamp-1 flex gap-1 font-medium">
            Technology stacks <IconStack className="size-3" />
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs">Skills</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {stats.totalSkills.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs">
              <IconCode className="size-3" />
              Listed
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs pt-0">
          <div className="line-clamp-1 flex gap-1 font-medium">
            Available skills <IconCode className="size-3" />
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs">Classes</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {stats.totalClasses.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs">
              <IconSchool className="size-3" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs pt-0">
          <div className="line-clamp-1 flex gap-1 font-medium">
            Student classes <IconSchool className="size-3" />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}