'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { GuestNavbar } from '@/components/guest-navbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Github, ExternalLink, Calendar, User, FolderOpen, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ProjectMedia {
  id: string
  mediaUrl: string
  mediaType: string
}

interface Techstack {
  id: string
  name: string
  iconUrl: string | null
  bgHex: string
  borderHex: string
  textHex: string
}

interface Category {
  id: string
  name: string
  bgHex: string
  borderHex: string
  textHex: string
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
        setError(err instanceof Error ? err.message : 'Failed to load project')
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
      <div className="min-h-screen bg-background">
        <GuestNavbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <GuestNavbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
            <p className="text-muted-foreground mb-4">{error || 'The project you are looking for does not exist.'}</p>
            <Button asChild>
              <Link href="/projects">Back to Projects</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <GuestNavbar />
      
      {/* Main Content */}
      <main className="pt-20">
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
              <Button asChild size="sm">
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

            <Separator />

            {/* Thumbnail Image - Moved below separator */}
            {project.thumbnailUrl && (
              <div className="mt-8 mb-8">
                <div className="relative aspect-video rounded-lg overflow-hidden">
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
          </header>

          {/* Description */}
          {project.description && (
            <div className="mb-12">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </div>
          )}

          {/* Tech Stack */}
          {project.techstacks && project.techstacks.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-foreground">Tech Stack</h2>
              <div className="flex flex-wrap gap-3">
                {project.techstacks.map(({ techstack }) => (
                  <Badge
                    key={techstack.id}
                    variant="outline"
                    style={{
                      backgroundColor: techstack.bgHex,
                      borderColor: techstack.borderHex,
                      color: techstack.textHex
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium"
                  >
                    {techstack.iconUrl && (
                      <Image
                        src={techstack.iconUrl}
                        alt={techstack.name}
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                    )}
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
                      <Image
                        src={media.mediaUrl}
                        alt={`${project.title} - Image ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Author Section */}
          <div className="border-t pt-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  {project.student.profilePhotoUrl ? (
                    <img 
                      src={project.student.profilePhotoUrl} 
                      alt={project.student.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
                      {project.student.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {project.student.fullName}
                  </h3>
                  {project.student.class && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {project.student.class.name}
                    </p>
                  )}
                </div>
                <Link 
                  href={`/students/${project.student.id}`}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-2"
                >
                  View Profile
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}