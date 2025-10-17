"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { IconBrandGithub, IconExternalLink, IconCalendar, IconEye } from "@tabler/icons-react"
import Link from "next/link"
import Image from "next/image"

interface FeedPostProps {
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
      userId: string | null
      username: string | null
    }
    category: {
      id: string
      name: string
      bgHex: string
      borderHex: string
      textHex: string
    } | null
    projectTechstacks: Array<{
      projectId: string
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
}

export function FeedPost({ project }: FeedPostProps) {
  const displayedTechstacks = project.projectTechstacks.slice(0, 4)

  return (
    <Card className="w-full bg-card border border-border hover:bg-accent/5 transition-colors duration-200 rounded-none">
      <CardContent className="p-4">
        {/* Student Profile Header */}
        <div className="flex items-start gap-3 mb-4">
          <Link href={`/app/${project.student.username || project.student.id}`}>
            <Avatar className="h-12 w-12 ring-2 ring-border hover:ring-primary/50 transition-all duration-200">
              <AvatarImage src={project.student.profilePhotoUrl || ""} />
              <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                {project.student.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link 
                href={`/app/${project.student.username || project.student.id}`}
                className="font-semibold text-foreground hover:text-primary transition-colors duration-200"
              >
                {project.student.fullName}
              </Link>
              {project.student.username && (
                <span className="text-muted-foreground text-sm">
                  @{project.student.username}
                </span>
              )}
              {project.student.className && (
                <>
                  <span className="text-muted-foreground text-sm">•</span>
                  <span className="text-muted-foreground text-sm">
                    {project.student.className}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <IconCalendar className="h-3 w-3" />
              <span>
                {new Date(project.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Project Content */}
        <div className="ml-15 space-y-4">
          {/* Project Title and Description */}
          <div>
            <h3 className="font-bold text-lg text-foreground mb-2">
              {project.title}
            </h3>
            {project.description && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {project.description}
              </p>
            )}
          </div>

          {/* Project Thumbnail */}
          {project.thumbnailUrl && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          {/* Category and Techstacks */}
          <div className="flex flex-wrap gap-2">
            {project.category && (
              <Badge
                className="text-xs px-2 py-1 font-medium"
                style={{
                  backgroundColor: project.category.bgHex,
                  borderColor: project.category.borderHex,
                  color: project.category.textHex,
                }}
              >
                {project.category.name}
              </Badge>
            )}
            {displayedTechstacks.map((item) => (
              <Badge
                key={item.techstack.id}
                className="text-xs px-2 py-1 font-medium"
                style={{
                  backgroundColor: item.techstack.bgHex,
                  borderColor: item.techstack.borderHex,
                  color: item.techstack.textHex,
                }}
              >
                {item.techstack.name}
              </Badge>
            ))}
            {project.projectTechstacks.length > 4 && (
              <Badge variant="outline" className="text-xs px-2 py-1 text-muted-foreground border-dashed">
                +{project.projectTechstacks.length - 4}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              asChild
              size="sm"
              variant="default"
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Link href={`/app/projects/${project.id}`}>
                <IconEye className="h-4 w-4 mr-2" />
                Lihat Detail Project
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="flex-1 bg-background hover:bg-accent"
            >
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <IconBrandGithub className="h-4 w-4 mr-2" />
                GitHub
              </Link>
            </Button>
            {project.liveDemoUrl && (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="flex-1 bg-background hover:bg-accent"
              >
                <Link href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                  <IconExternalLink className="h-4 w-4 mr-2" />
                  Demo
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}