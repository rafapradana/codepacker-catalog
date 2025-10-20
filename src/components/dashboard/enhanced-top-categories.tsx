"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  ExternalLink, 
  TrendingUp,
  Heart,
  Award,
  BarChart3
} from "lucide-react";
import { EnhancedDashboardStats } from "@/lib/enhanced-dashboard-stats";
import Link from "next/link";

interface EnhancedTopCategoriesProps {
  stats: EnhancedDashboardStats;
}

export function EnhancedTopCategories({ stats }: EnhancedTopCategoriesProps) {
  const maxProjectCount = Math.max(...stats.topCategories.map(cat => cat.projectCount), 1);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Kategori Teratas
          </CardTitle>
          <CardDescription>
            Kategori dengan proyek terbanyak dan performa terbaik
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/categories">
            Kelola Kategori
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.topCategories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada kategori dengan proyek</p>
            </div>
          ) : (
            stats.topCategories.map((category, index) => {
              const percentage = (category.projectCount / maxProjectCount) * 100;
              
              return (
                <div
                  key={category.name}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">
                          {category.name}
                        </h4>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <BookOpen className="h-3 w-3" />
                            <span>{category.projectCount} proyek</span>
                          </div>
                          {category.totalLikes > 0 && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Heart className="h-3 w-3" />
                              <span>{category.totalLikes} likes</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Badge 
                      variant="secondary"
                      style={{
                        backgroundColor: category.bgHex,
                        borderColor: category.borderHex,
                        color: category.textHex,
                      }}
                    >
                      {category.name}
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

                  {/* Additional Metrics */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center gap-4">
                      {category.averageScore !== null && (
                        <div className="flex items-center gap-1 text-sm">
                          <Award className="h-3 w-3 text-yellow-600" />
                          <span className="text-muted-foreground">Rata-rata:</span>
                          <span className="font-medium">
                            {category.averageScore.toFixed(1)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-muted-foreground">Engagement:</span>
                        <span className="font-medium">
                          {category.projectCount > 0 
                            ? (category.totalLikes / category.projectCount).toFixed(1)
                            : '0'
                          } likes/proyek
                        </span>
                      </div>
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