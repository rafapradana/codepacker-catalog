"use client"

import * as React from "react"
import { IconBrandGithub, IconExternalLink, IconCalendar, IconEdit, IconTrash, IconEye } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ProjectWithDetails } from "@/lib/projects"
import Link from "next/link"
import Image from "next/image"

// Admin interface for dashboard
interface AdminProjectCardProps {
  project: ProjectWithDetails
  onEdit: (project: ProjectWithDetails) => void
  onDelete: (projectId: string) => void
  onView: (project: ProjectWithDetails) => void
  isLoading?: boolean
}

// Public interface for projects page
interface PublicProjectCardProps {
  project: {
    id: string
    title: string
    description: string | null
    thumbnailUrl: string | null
    githubUrl: string
    liveDemoUrl: string | null
    createdAt: string
    updatedAt: string
    student: {
      id: string
      fullName: string
      profilePhotoUrl: string | null
      classId: string | null
      className: string | null
    }
    category: {
      id: string
      name: string
      bgHex: string
      borderHex: string
      textHex: string
    } | null
    projectTechstacks: Array<{
      id: string
      techstack: {
        id: string
        name: string
        iconUrl: string | null
        bgHex: string
        borderHex: string
        textHex: string
      }
    }>
    projectMedia: Array<{
      id: string
      mediaUrl: string
      mediaType: string
    }>
  }
  hideStudentInfo?: boolean // New prop to hide student info on profile pages
}

type ProjectCardProps = AdminProjectCardProps | PublicProjectCardProps

// Type guard to check if it's admin props
function isAdminProps(props: ProjectCardProps): props is AdminProjectCardProps {
  return 'onEdit' in props && 'onDelete' in props && 'onView' in props
}

export function ProjectCard(props: ProjectCardProps) {
  const { project } = props
  
  // If it's admin props, render admin version
  if (isAdminProps(props)) {
    const { onEdit, onDelete, onView, isLoading = false } = props
    
    return (
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 border-border/50 py-0">
        {/* Thumbnail Section */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted/30 to-muted/60">
          {project.thumbnailUrl ? (
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary/60">
                    {project.title.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">No Image</span>
              </div>
            </div>
          )}
          
          {/* Category Badge */}
          {project.category && (
            <div className="absolute top-3 left-3">
              <Badge
                variant="secondary"
                className="text-xs font-medium shadow-sm backdrop-blur-sm"
                style={{
                  backgroundColor: project.category.bgHex || undefined,
                  borderColor: project.category.borderHex || undefined,
                  color: project.category.textHex || undefined,
                }}
              >
                {project.category.name}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Title & Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-foreground">
              {project.title}
            </h3>
            {project.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            )}
          </div>

          {/* Student Info */}
          {project.student && (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
              <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                <AvatarImage src={project.student.profilePhotoUrl || undefined} />
                <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                  {project.student.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-foreground">
                  {project.student.fullName}
                </p>
                {project.student.className && (
                  <p className="text-xs text-muted-foreground truncate">
                    {project.student.className}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Tech Stacks */}
          {(('techstacks' in project && project.techstacks) || ('projectTechstacks' in project && project.projectTechstacks)) && 
           (('techstacks' in project && project.techstacks?.length > 0) || ('projectTechstacks' in project && project.projectTechstacks?.length > 0)) && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(('techstacks' in project ? project.techstacks : project.projectTechstacks) || [])
                  .slice(0, 4)
                  .filter((pt: any) => pt.techstack && pt.techstack.name)
                  .map((pt: any, index: number) => (
                    <Badge 
                      key={pt.techstack?.id || `techstack-${index}`} 
                      variant="outline" 
                      className="text-xs font-medium px-2.5 py-1 border-border/60"
                      style={{
                        backgroundColor: pt.techstack?.bgHex || undefined,
                        borderColor: pt.techstack?.borderHex || undefined,
                        color: pt.techstack?.textHex || undefined,
                      }}
                    >
                      {pt.techstack?.name}
                    </Badge>
                  ))}
                {(('techstacks' in project ? project.techstacks : project.projectTechstacks) || []).length > 4 && (
                  <Badge variant="outline" className="text-xs font-medium px-2.5 py-1 text-muted-foreground">
                    +{(('techstacks' in project ? project.techstacks : project.projectTechstacks) || []).length - 4}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Project Media Preview */}
          {('projectMedia' in project ? project.projectMedia : project.media) && 
           ('projectMedia' in project ? project.projectMedia : project.media).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Media ({('projectMedia' in project ? project.projectMedia : project.media).length})
              </h4>
              <div className="flex gap-2">
                {('projectMedia' in project ? project.projectMedia : project.media).slice(0, 4).map((media: any, index: number) => (
                  <div key={media.id || `media-${index}`} className="w-10 h-10 rounded-md overflow-hidden bg-muted border border-border/50">
                    {media.mediaType === 'image' ? (
                      <img 
                        src={media.mediaUrl} 
                        alt="Project media" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video 
                        src={media.mediaUrl} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
                {('projectMedia' in project ? project.projectMedia : project.media).length > 4 && (
                  <div className="w-10 h-10 rounded-md bg-muted border border-border/50 flex items-center justify-center">
                    <span className="text-xs font-medium text-muted-foreground">
                      +{('projectMedia' in project ? project.projectMedia : project.media).length - 4}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/30">
            <IconCalendar className="h-3.5 w-3.5" />
            <span className="font-medium">
              {new Date(project.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>
        </CardContent>

        {/* Actions */}
        <CardFooter className="p-3 pt-0 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(project as ProjectWithDetails)}
            disabled={isLoading}
            className="flex-1 h-8 font-medium text-xs"
          >
            <IconEye className="h-3.5 w-3.5 mr-1.5" />
            View
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(project as ProjectWithDetails)}
            disabled={isLoading}
            className="flex-1 h-8 font-medium text-xs"
          >
            <IconEdit className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="h-8 px-2.5 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
              >
                <IconTrash className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{project.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(project.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    )
  }
  
  // Public version for projects page
  const { hideStudentInfo = false } = props
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 border-border/50 h-full flex flex-col py-0">
      {/* Thumbnail Section */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted/30 to-muted/60">
        {project.thumbnailUrl ? (
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary/60">
                  {project.title.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">No Preview</span>
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        {project.category && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 left-2 text-xs font-medium shadow-sm backdrop-blur-sm"
            style={{
              backgroundColor: project.category.bgHex || undefined,
              borderColor: project.category.borderHex || undefined,
              color: project.category.textHex || undefined,
            }}
          >
            {project.category.name}
          </Badge>
        )}
      </div>

      <CardContent className="p-3 space-y-2.5 flex-1 flex flex-col">
        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-foreground">
            {project.title}
          </h3>
          {project.description && (
            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* Student Info - Hidden when hideStudentInfo is true */}
        {project.student && !hideStudentInfo && (
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/30 border border-border/30">
            <Avatar className="h-7 w-7 border-2 border-background shadow-sm">
              <AvatarImage src={project.student.profilePhotoUrl || undefined} />
              <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                {project.student.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-foreground">
                {project.student.fullName}
              </p>
              {project.student.className && (
                <p className="text-xs text-muted-foreground truncate font-medium">
                  {project.student.className}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Date & Actions */}
        <div className="space-y-2.5 mt-auto pt-2.5 border-t border-border/30">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <IconCalendar className="h-3 w-3" />
            <span className="font-medium">
              {new Date(project.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>

          {/* Action Button - Full width "Lihat Detail" */}
          <Link href={`/projects/${project.id}`} className="block w-full">
            <Button variant="default" size="sm" className="w-full h-8 text-xs font-medium">
              <IconEye className="h-3 w-3 mr-1" />
              Lihat Detail
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}