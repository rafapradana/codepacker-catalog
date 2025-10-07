"use client"

import * as React from "react"
import { IconBrandGithub, IconExternalLink, IconCalendar, IconEdit, IconTrash, IconEye } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

interface ProjectCardProps {
  project: ProjectWithDetails
  onEdit: (project: ProjectWithDetails) => void
  onDelete: (projectId: string) => void
  onView: (project: ProjectWithDetails) => void
  isLoading?: boolean
}

export function ProjectCard({ project, onEdit, onDelete, onView, isLoading = false }: ProjectCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <span className="text-4xl font-bold text-muted-foreground/30">
              {project.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        {/* Category Badge - Positioned at top-left corner */}
        {project.category && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 left-2 text-xs shadow-sm"
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

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">{project.title}</h3>
          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
          )}
        </div>

        {/* Student Info */}
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={project.student?.profilePhotoUrl || ""} />
            <AvatarFallback className="text-xs">
              {project.student?.fullName?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground truncate">
            {project.student?.fullName || "Unknown Student"}
          </span>
        </div>

        {/* Tech Stacks */}
        {project.techstacks && project.techstacks.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.techstacks.slice(0, 3).map((pt) => (
              pt.techstack && (
                <Badge
                  key={pt.id}
                  variant="outline"
                  className="text-xs px-2 py-0.5"
                  style={{
                    backgroundColor: pt.techstack.bgHex || undefined,
                    borderColor: pt.techstack.borderHex || undefined,
                    color: pt.techstack.textHex || undefined,
                  }}
                >
                  {pt.techstack.name}
                </Badge>
              )
            ))}
            {project.techstacks.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{project.techstacks.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <IconCalendar className="h-3 w-3" />
          <span>{new Date(project.createdAt).toLocaleDateString('id-ID')}</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2"
              onClick={(e) => {
                e.stopPropagation()
                window.open(project.githubUrl, '_blank')
              }}
            >
              <IconBrandGithub className="h-3 w-3" />
            </Button>
          )}
          {project.liveDemoUrl && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2"
              onClick={(e) => {
                e.stopPropagation()
                window.open(project.liveDemoUrl, '_blank')
              }}
            >
              <IconExternalLink className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(project)}
            className="h-8 px-2 text-xs"
          >
            <IconEye className="h-3 w-3 mr-1" />
            Detail
          </Button>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(project)}
              className="h-8 px-2"
            >
              <IconEdit className="h-3 w-3" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-destructive hover:text-destructive"
                >
                  <IconTrash className="h-3 w-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Project</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin menghapus project "{project.title}"? 
                    Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(project.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Menghapus..." : "Hapus"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  )
}