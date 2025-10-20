"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  ExternalLink, 
  Github, 
  Eye,
  Calendar,
  User
} from "lucide-react";
import { EnhancedDashboardStats } from "@/lib/enhanced-dashboard-stats";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";

interface EnhancedRecentProjectsProps {
  stats: EnhancedDashboardStats;
}

export function EnhancedRecentProjects({ stats }: EnhancedRecentProjectsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Proyek Terbaru
          </CardTitle>
          <CardDescription>
            5 proyek yang baru saja dibuat
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/projects">
            Lihat Semua
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.recentProjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada proyek yang dibuat</p>
            </div>
          ) : (
            stats.recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-start space-x-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                {/* Project Thumbnail */}
                <div className="flex-shrink-0">
                  {project.thumbnailUrl ? (
                    <Avatar className="h-12 w-12 rounded-md">
                      <AvatarImage 
                        src={project.thumbnailUrl} 
                        alt={project.title}
                        className="object-cover"
                      />
                      <AvatarFallback className="rounded-md">
                        {project.title.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                      <span className="text-sm font-medium text-muted-foreground">
                        {project.title.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {project.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {project.studentName}
                        </p>
                      </div>
                    </div>
                    
                    {/* Category Badge */}
                    {project.category && (
                      <Badge 
                        variant="secondary"
                        className="ml-2 text-xs"
                        style={{
                          backgroundColor: project.category.bgHex,
                          borderColor: project.category.borderHex,
                          color: project.category.textHex,
                        }}
                      >
                        {project.category.name}
                      </Badge>
                    )}
                  </div>

                  {/* Date and Actions */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(project.createdAt), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        asChild
                      >
                        <Link href={`/admin/projects/${project.id}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          Detail
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}