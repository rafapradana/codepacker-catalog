"use client"

import * as React from "react"
import { IconBrandGithub, IconExternalLink, IconCalendar, IconEdit, IconTrash, IconEye, IconHeart, IconHeartFilled } from "@tabler/icons-react"
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
import { getStudentSession } from "@/lib/session"
import { toast } from "sonner"

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
  isStudentApp?: boolean // New prop to determine routing context
  showEditButton?: boolean // New prop to show edit button for student's own projects
  currentStudentId?: string // New prop to check if current user owns the project
  onDelete?: (projectId: string) => void // New prop for delete functionality
}

type ProjectCardProps = AdminProjectCardProps | PublicProjectCardProps

// Type guard to check if it's admin props
function isAdminProps(props: ProjectCardProps): props is AdminProjectCardProps {
  return 'onEdit' in props && 'onDelete' in props && 'onView' in props
}

export function ProjectCard(props: ProjectCardProps) {
  const { project } = props
  
  // Like functionality state
  const [likeCount, setLikeCount] = React.useState(0)
  const [isLiked, setIsLiked] = React.useState(false)
  const [isLikeLoading, setIsLikeLoading] = React.useState(false)

  // Fetch like status on component mount
  React.useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const session = getStudentSession()
        const studentId = session?.studentId || ''
        
        const response = await fetch(`/api/projects/${project.id}/like?studentId=${studentId}`)
        if (response.ok) {
          const data = await response.json()
          setLikeCount(data.likeCount)
          setIsLiked(data.isLiked)
        }
      } catch (error) {
        console.error('Error fetching like status:', error)
      }
    }

    fetchLikeStatus()
  }, [project.id])

  // Handle like/unlike
  const handleLikeToggle = async () => {
    const session = getStudentSession()
    
    if (!session?.studentId) {
      toast.error('Silakan login untuk menyukai project')
      return
    }

    setIsLikeLoading(true)
    try {
      const response = await fetch(`/api/projects/${project.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: session.studentId
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.action === 'liked') {
          setIsLiked(true)
          setLikeCount(prev => prev + 1)
          toast.success('Project berhasil disukai!')
        } else {
          setIsLiked(false)
          setLikeCount(prev => prev - 1)
          toast.success('Like berhasil dihapus')
        }
      } else {
        toast.error('Gagal memproses like')
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLikeLoading(false)
    }
  }
  
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
  const { hideStudentInfo = false, isStudentApp = false, showEditButton = false, currentStudentId, onDelete } = props
  
  // Determine the correct route based on context
  const projectDetailRoute = isStudentApp ? `/app/projects/${project.id}` : `/projects/${project.id}`
  
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 border-border/50 h-full flex flex-col py-0">
      {/* Thumbnail Section */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted/30 to-muted/60">
        {project.thumbnailUrl ? (
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
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

          {/* Action Button - Full width "Lihat Detail" or with Edit button */}
          {showEditButton && currentStudentId === project.student?.id ? (
            <div className="flex gap-2">
              <Link href={projectDetailRoute} className="flex-1">
                <Button variant="default" size="sm" className="w-full h-8 text-xs font-medium">
                  <IconEye className="h-3 w-3 mr-1" />
                  Lihat Detail
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLikeToggle}
                disabled={isLikeLoading}
                className="h-8 px-2 text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                {isLiked ? (
                  <IconHeartFilled className="h-3 w-3 text-red-500" />
                ) : (
                  <IconHeart className="h-3 w-3" />
                )}
                <span className="ml-1 text-xs">{likeCount}</span>
              </Button>
              <Link href={`/app/projects/${project.id}/edit`}>
                <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                  <IconEdit className="h-3 w-3" />
                </Button>
              </Link>
              {onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                    >
                      <IconTrash className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Project</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus "{project.title}"? Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(project.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href={projectDetailRoute} className="flex-1">
                <Button variant="default" size="sm" className="w-full h-8 text-xs font-medium">
                  <IconEye className="h-3 w-3 mr-1" />
                  Lihat Detail
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLikeToggle}
                disabled={isLikeLoading}
                className="h-8 px-2 text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                {isLiked ? (
                  <IconHeartFilled className="h-3 w-3 text-red-500" />
                ) : (
                  <IconHeart className="h-3 w-3" />
                )}
                <span className="ml-1 text-xs">{likeCount}</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}