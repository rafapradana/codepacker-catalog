'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Github, ExternalLink, Calendar, User, FolderOpen, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  bgHex: string
  borderHex: string
  textHex: string
}

interface Techstack {
  id: string
  name: string
  iconUrl: string | null
  bgHex: string
  borderHex: string
  textHex: string
}

interface ProjectMedia {
  id: string
  mediaUrl: string
  mediaType: string
}

interface Student {
  id: string
  fullName: string
  profilePhotoUrl: string | null
  userId: string
  username: string
  className?: string | null
  class?: {
    id: string
    name: string
  } | null
}

interface ProjectDetail {
  id: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  githubUrl: string
  liveDemoUrl: string | null
  createdAt: string
  updatedAt: string
  student: Student
  category: Category | null
  techstacks: Array<{
    techstack: Techstack
  }>
  media: ProjectMedia[]
}

export default function ProjectDetailPage() {
  const params = useParams()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`)
        if (!response.ok) {
          throw new Error('Project not found')
        }
        const data = await response.json()
        setProject(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProject()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-border flex items-center justify-center">
            <FolderOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Project Not Found</h3>
          <p className="text-muted-foreground text-sm mb-4">{error || 'The project you are looking for does not exist.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background">
      {/* Main Content */}
      <main className="pt-6">
        {/* Article-like Content */}
        <article className="max-w-3xl mx-auto px-6 pb-16">
          {/* Header */}
          <header className="mb-8">
            {/* Category Badge */}
            {project.category && (
              <div className="mb-4">
                <Badge 
                  variant="outline"
                  style={{
                    backgroundColor: project.category.bgHex,
                    borderColor: project.category.borderHex,
                    color: project.category.textHex
                  }}
                  className="text-sm font-medium"
                >
                  {project.category.name}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-foreground">
              {project.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                  {project.student.profilePhotoUrl ? (
                    <img 
                      src={project.student.profilePhotoUrl} 
                      alt={project.student.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-medium">
                      {project.student.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <Link 
                    href={`/students/${project.student.id}`}
                    className="hover:text-foreground transition-colors font-medium"
                  >
                    {project.student.fullName}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    @{project.student.username || 'username'}
                    {project.student.class && (
                      <span> • {project.student.class.name}</span>
                    )}
                    {project.student.className && (
                      <span> • {project.student.className}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(project.createdAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Button asChild variant="default" size="sm">
                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  View Code
                </Link>
              </Button>
              {project.liveDemoUrl && (
                <Button asChild variant="outline" size="sm">
                  <Link href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </Link>
                </Button>
              )}
            </div>
          </header>

          {/* Project Image */}
          {project.thumbnailUrl && (
            <div className="mb-8">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={project.thumbnailUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Description */}
          {project.description && (
            <div className="mb-8">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </div>
          )}

          {/* Tech Stack */}
          {project.techstacks && project.techstacks.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.techstacks.map(({ techstack }) => (
                  <Badge
                    key={techstack.id}
                    variant="outline"
                    style={{
                      backgroundColor: techstack.bgHex,
                      borderColor: techstack.borderHex,
                      color: techstack.textHex
                    }}
                    className="text-sm font-medium px-3 py-1"
                  >
                    {techstack.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Project Media Gallery */}
          {project.media && project.media.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-foreground">Project Gallery</h2>
              <div className="space-y-8">
                {project.media.map((media, index) => (
                  <div key={media.id} className="w-full">
                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                      {media.mediaType === 'image' ? (
                        <Image
                          src={media.mediaUrl}
                          alt={`${project.title} - Image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : media.mediaType === 'video' ? (
                        <video
                          src={media.mediaUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-muted">
                          <p className="text-muted-foreground">Unsupported media type: {media.mediaType}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-8" />

          {/* Footer Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild variant="default">
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </Link>
            </Button>
            {project.liveDemoUrl && (
              <Button asChild variant="outline">
                <Link href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Try Live Demo
                </Link>
              </Button>
            )}
            <Button asChild variant="outline">
              <Link href={`/students/${project.student.id}`}>
                <User className="w-4 h-4 mr-2" />
                View Profile
              </Link>
            </Button>
          </div>
        </article>
      </main>
    </div>
  )
}