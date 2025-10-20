"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  ExternalLink, 
  Users,
  FolderOpen,
  Award,
  Heart,
  TrendingUp
} from "lucide-react";
import { EnhancedDashboardStats } from "@/lib/enhanced-dashboard-stats";
import Link from "next/link";

interface ClassPerformanceChartProps {
  stats: EnhancedDashboardStats;
}

export function ClassPerformanceChart({ stats }: ClassPerformanceChartProps) {
  const maxScore = Math.max(...stats.classPerformance.map(cls => cls.averageScore || 0), 100);
  const maxProjects = Math.max(...stats.classPerformance.map(cls => cls.projectCount), 1);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Performa Kelas
          </CardTitle>
          <CardDescription>
            Analisis performa dan aktivitas setiap kelas
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/classes">
            Kelola Kelas
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.classPerformance.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada data performa kelas</p>
            </div>
          ) : (
            stats.classPerformance.map((classData, index) => {
              const scorePercentage = classData.averageScore ? (classData.averageScore / 100) * 100 : 0;
              const projectPercentage = (classData.projectCount / maxProjects) * 100;
              const avgLikesPerProject = classData.projectCount > 0 
                ? classData.totalLikes / classData.projectCount 
                : 0;
              
              return (
                <div
                  key={classData.className}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                        {classData.className.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground text-lg">
                          {classData.className}
                        </h4>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{classData.studentCount} siswa</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <FolderOpen className="h-3 w-3" />
                            <span>{classData.projectCount} proyek</span>
                          </div>
                          {classData.totalLikes > 0 && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Heart className="h-3 w-3" />
                              <span>{classData.totalLikes} likes</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {classData.averageScore !== null && (
                      <Badge 
                        variant={classData.averageScore >= 80 ? "default" : classData.averageScore >= 70 ? "secondary" : "destructive"}
                        className="text-sm px-3 py-1"
                      >
                        <Award className="h-3 w-3 mr-1" />
                        {classData.averageScore.toFixed(1)}
                      </Badge>
                    )}
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Average Score */}
                    {classData.averageScore !== null && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Rata-rata Skor</span>
                          <span className="font-medium">{classData.averageScore.toFixed(1)}/100</span>
                        </div>
                        <Progress value={scorePercentage} className="h-2" />
                      </div>
                    )}

                    {/* Project Activity */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Aktivitas Proyek</span>
                        <span className="font-medium">{projectPercentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={projectPercentage} className="h-2" />
                    </div>
                  </div>

                  {/* Additional Stats */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-6">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Proyek per siswa:</span>
                        <span className="font-medium ml-1">
                          {classData.studentCount > 0 
                            ? (classData.projectCount / classData.studentCount).toFixed(1)
                            : '0'
                          }
                        </span>
                      </div>
                      
                      {avgLikesPerProject > 0 && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Likes per proyek:</span>
                          <span className="font-medium ml-1">
                            {avgLikesPerProject.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-muted-foreground">Rank:</span>
                      <span className="font-medium">#{index + 1}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}