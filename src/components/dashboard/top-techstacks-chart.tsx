"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Code, 
  ExternalLink, 
  TrendingUp,
  Layers
} from "lucide-react";
import { EnhancedDashboardStats } from "@/lib/enhanced-dashboard-stats";
import Link from "next/link";

interface TopTechStacksChartProps {
  stats: EnhancedDashboardStats;
}

export function TopTechStacksChart({ stats }: TopTechStacksChartProps) {
  const maxProjectCount = Math.max(...stats.topTechStacks.map(tech => tech.projectCount), 1);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Tech Stack Populer
          </CardTitle>
          <CardDescription>
            Teknologi yang paling banyak digunakan dalam proyek
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/techstacks">
            Kelola Tech Stack
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.topTechStacks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada tech stack yang digunakan</p>
            </div>
          ) : (
            stats.topTechStacks.map((techstack, index) => {
              const percentage = (techstack.projectCount / maxProjectCount) * 100;
              
              return (
                <div
                  key={techstack.name}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        #{index + 1}
                      </div>
                      
                      {/* Tech Stack Icon */}
                      <div className="flex items-center gap-3">
                        {techstack.iconUrl ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage 
                              src={techstack.iconUrl} 
                              alt={techstack.name}
                            />
                            <AvatarFallback 
                              className="text-xs"
                              style={{
                                backgroundColor: techstack.bgHex,
                                color: techstack.textHex,
                              }}
                            >
                              {techstack.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div 
                            className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium"
                            style={{
                              backgroundColor: techstack.bgHex,
                              color: techstack.textHex,
                            }}
                          >
                            {techstack.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        
                        <div>
                          <h4 className="font-medium text-foreground">
                            {techstack.name}
                          </h4>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Code className="h-3 w-3" />
                            <span>{techstack.projectCount} proyek</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Badge 
                      variant="secondary"
                      style={{
                        backgroundColor: techstack.bgHex,
                        borderColor: techstack.borderHex,
                        color: techstack.textHex,
                      }}
                    >
                      {techstack.name}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Popularitas</span>
                      <span className="font-medium">{percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>

                  {/* Usage Stats */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-muted-foreground">Digunakan dalam</span>
                      <span className="font-medium">
                        {techstack.projectCount} dari {stats.totalProjects} proyek
                      </span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {stats.totalProjects > 0 
                        ? `${((techstack.projectCount / stats.totalProjects) * 100).toFixed(1)}%`
                        : '0%'
                      } dari total
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