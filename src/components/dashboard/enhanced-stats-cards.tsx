"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  FolderOpen, 
  BookOpen, 
  Award, 
  Code, 
  GraduationCap,
  TrendingUp,
  Heart,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target
} from "lucide-react";
import { EnhancedDashboardStats } from "@/lib/enhanced-dashboard-stats";

interface EnhancedStatsCardsProps {
  stats: EnhancedDashboardStats;
}

export function EnhancedStatsCards({ stats }: EnhancedStatsCardsProps) {
  const basicStats = [
    {
      title: "Total Siswa",
      value: stats.totalStudents,
      description: "Siswa terdaftar",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Total Proyek",
      value: stats.totalProjects,
      description: "Proyek dibuat",
      icon: FolderOpen,
      color: "text-green-600",
    },
    {
      title: "Kategori",
      value: stats.totalCategories,
      description: "Kategori tersedia",
      icon: BookOpen,
      color: "text-purple-600",
    },
    {
      title: "Tech Stack",
      value: stats.totalTechstacks,
      description: "Teknologi tersedia",
      icon: Code,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Basic Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {basicStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance & Quality Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Assessment Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Penilaian Proyek
            </CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-bold">
              {stats.assessmentStats.averageScore.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Rata-rata skor penilaian
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Dinilai</span>
                <span>{stats.assessmentStats.totalAssessed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Belum dinilai</span>
                <span>{stats.assessmentStats.totalUnassessed}</span>
              </div>
              <Progress 
                value={stats.assessmentStats.assessmentRate} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {stats.assessmentStats.assessmentRate.toFixed(1)}% proyek telah dinilai
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Engagement
            </CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-bold">
              {stats.engagementStats.totalLikes}
            </div>
            <p className="text-xs text-muted-foreground">
              Total likes proyek
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Rata-rata per proyek</span>
                <span>{stats.engagementStats.averageLikesPerProject.toFixed(1)}</span>
              </div>
              {stats.engagementStats.mostLikedProject && (
                <div className="p-2 bg-muted rounded-md">
                  <p className="text-xs font-medium">Proyek Terpopuler:</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {stats.engagementStats.mostLikedProject.title}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {stats.engagementStats.mostLikedProject.likes} likes
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Completion Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Kelengkapan Proyek
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-bold">
              {stats.completionStats.completionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Proyek lengkap
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>GitHub</span>
                <span>{stats.completionStats.withGithub}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Demo</span>
                <span>{stats.completionStats.withDemo}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Thumbnail</span>
                <span>{stats.completionStats.withThumbnail}</span>
              </div>
              <Progress 
                value={stats.completionStats.completionRate} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Needing Attention */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Proyek Memerlukan Perhatian
          </CardTitle>
          <CardDescription>
            Proyek yang memerlukan tindak lanjut
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div>
                <p className="text-sm font-medium text-amber-800">Belum Dinilai</p>
                <p className="text-2xl font-bold text-amber-900">
                  {stats.projectsNeedingAttention.unassessed}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div>
                <p className="text-sm font-medium text-red-800">Tidak Lengkap</p>
                <p className="text-2xl font-bold text-red-900">
                  {stats.projectsNeedingAttention.incomplete}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div>
                <p className="text-sm font-medium text-orange-800">Skor Rendah</p>
                <p className="text-2xl font-bold text-orange-900">
                  {stats.projectsNeedingAttention.lowScore}
                </p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}