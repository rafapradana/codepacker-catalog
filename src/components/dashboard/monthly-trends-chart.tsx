"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { 
  TrendingUp, 
  Calendar,
  BarChart3,
  Award
} from "lucide-react";
import { EnhancedDashboardStats } from "@/lib/enhanced-dashboard-stats";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";

interface MonthlyTrendsChartProps {
  stats: EnhancedDashboardStats;
}

const chartConfig = {
  projects: {
    label: "Proyek Dibuat",
    color: "hsl(var(--primary))",
  },
  assessments: {
    label: "Penilaian Selesai",
    color: "hsl(var(--secondary))",
  },
  avgScore: {
    label: "Rata-rata Skor",
    color: "hsl(var(--primary))",
  },
}

export function MonthlyTrendsChart({ stats }: MonthlyTrendsChartProps) {
  // Format data for chart
  const chartData = stats.monthlyTrends.map(trend => ({
    month: new Date(trend.month + '-01').toLocaleDateString('id-ID', { 
      month: 'short', 
      year: '2-digit' 
    }),
    projects: trend.projectsCreated,
    assessments: trend.assessmentsCompleted,
    avgScore: trend.averageScore || 0,
  }));

  const totalProjects = stats.monthlyTrends.reduce((sum, trend) => sum + trend.projectsCreated, 0);
  const totalAssessments = stats.monthlyTrends.reduce((sum, trend) => sum + trend.assessmentsCompleted, 0);
  const overallAvgScore = stats.monthlyTrends.length > 0 
    ? stats.monthlyTrends.reduce((sum, trend) => sum + (trend.averageScore || 0), 0) / stats.monthlyTrends.length
    : 0;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tren Bulanan (6 Bulan Terakhir)
            </CardTitle>
            <CardDescription>
              Aktivitas proyek dan penilaian dalam 6 bulan terakhir
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {totalProjects} proyek
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              {totalAssessments} penilaian
            </Badge>
            {overallAvgScore > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                {overallAvgScore.toFixed(1)} rata-rata
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Belum ada data tren</p>
            <p className="text-sm">Data akan muncul setelah ada aktivitas proyek</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Projects and Assessments Chart */}
            <div>
              <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Aktivitas Proyek & Penilaian
              </h4>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar 
                    dataKey="projects" 
                    fill="var(--color-projects)"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar 
                    dataKey="assessments" 
                    fill="var(--color-assessments)"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>

            {/* Average Score Trend */}
            {overallAvgScore > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Tren Rata-rata Skor
                </h4>
                <ChartContainer config={chartConfig} className="h-[200px]">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      fontSize={12}
                    />
                    <YAxis 
                      fontSize={12}
                      domain={[0, 100]}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="avgScore" 
                      stroke="var(--color-avgScore)"
                      strokeWidth={3}
                      dot={{ fill: 'var(--color-avgScore)', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: 'var(--color-avgScore)', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {totalProjects}
                </div>
                <p className="text-sm text-muted-foreground">Total Proyek</p>
              </div>
              
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {totalAssessments}
                </div>
                <p className="text-sm text-muted-foreground">Total Penilaian</p>
              </div>
              
              {overallAvgScore > 0 && (
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {overallAvgScore.toFixed(1)}
                  </div>
                  <p className="text-sm text-muted-foreground">Rata-rata Skor</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}