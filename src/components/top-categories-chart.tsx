"use client"

import * as React from "react"
import { IconTag, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DashboardStats } from "@/lib/dashboard-stats"

interface TopCategoriesChartProps {
  categories: DashboardStats['topCategories'];
}

export function TopCategoriesChart({ categories }: TopCategoriesChartProps) {
  const maxCount = Math.max(...categories.map(cat => cat.projectCount), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconTag className="size-5" />
          Top Categories
        </CardTitle>
        <CardDescription>
          Most popular project categories
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No categories found
          </div>
        ) : (
          categories.map((category, index) => {
            const percentage = (category.projectCount / maxCount) * 100;
            
            return (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full border"
                      style={{
                        backgroundColor: category.bgHex || '#f3f4f6',
                        borderColor: category.borderHex || '#d1d5db'
                      }}
                    />
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {category.projectCount} projects
                    </Badge>
                    {index === 0 && (
                      <Badge variant="outline" className="text-xs">
                        <IconTrendingUp className="size-3 mr-1" />
                        Top
                      </Badge>
                    )}
                  </div>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-2"
                />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  )
}