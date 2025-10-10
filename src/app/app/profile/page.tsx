'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, MapPin, Calendar } from "lucide-react"
import { ProjectCard } from "@/components/project-card"
import { FollowStats } from '@/components/follow-stats'
import { getStudentSession } from "@/lib/session"

interface Student {
  id: string
  fullName: string
  bio: string | null
  profilePhotoUrl: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  createdAt: string
  user: {
    username: string
    email: string
  }
  class: {
    name: string
  } | null
  studentSkills: Array<{
    skill: {
      id: string
      name: string
      iconUrl: string | null
      bgHex: string
      borderHex: string
      textHex: string
    }
  }>
  projects: Array<{
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
  }>
}

export default function ProfilePage() {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteProject = async (projectId: string) => {
    try {
      const session = getStudentSession()
      if (!session) {
        alert('Not logged in')
        return
      }

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.id}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      // Remove the project from the state
      setStudent(prev => {
        if (!prev) return prev
        return {
          ...prev,
          projects: prev.projects.filter(project => project.id !== projectId)
        }
      })
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete project')
    }
  }

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const session = getStudentSession()
        if (!session) {
          setError('Not logged in')
          setLoading(false)
          return
        }

        const response = await fetch('/api/students/profile/current', {
          headers: {
            'Authorization': `Bearer ${session.id}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }

        const data = await response.json()
        setStudent(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchStudentProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Error</h1>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Student not found</h1>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long'
    })
  }

  return (
    <main className="container mx-auto px-4 lg:px-16 xl:px-24 py-8 pt-24 bg-background min-h-screen">
      {/* Profile Header - Instagram Style */}
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 mb-8">
          {/* Profile Picture */}
          <div className="flex justify-center sm:justify-start flex-shrink-0">
            <Avatar className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 ring-2 ring-border">
              <AvatarImage src={student.profilePhotoUrl || ''} alt={student.fullName} />
              <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                {student.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            {/* Username and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <h1 className="text-xl sm:text-2xl font-light text-center sm:text-left text-foreground">
                {student.user.username}
              </h1>
              <div className="flex justify-center sm:justify-start gap-2">
                {student.githubUrl && (
                  <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                    <a href={student.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {student.linkedinUrl && (
                  <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                    <a href={student.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center sm:justify-start gap-8 mb-6">
              <div className="text-center">
                <div className="font-semibold text-lg text-foreground">{student.projects?.length || 0}</div>
                <div className="text-sm text-muted-foreground">projects</div>
              </div>
              <FollowStats studentId={student.id} />
            </div>

            {/* Full Name and Info */}
            <div className="text-center sm:text-left">
              <div className="font-semibold text-base mb-1 text-foreground">{student.fullName}</div>
              
              {/* Bio */}
              {student.bio && (
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{student.bio}</p>
              )}

              {/* Additional Info */}
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                {student.class && (
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{student.class.name}</span>
                  </div>
                )}
                
                {/* Skills Section - Moved here */}
                {student.studentSkills && student.studentSkills.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                      {student.studentSkills.map((skillItem) => (
                        <Badge
                          key={skillItem.skill.id}
                          variant="secondary"
                          className="px-3 py-1.5 text-xs font-medium flex items-center gap-1.5"
                          style={{
                            backgroundColor: skillItem.skill.bgHex || undefined,
                            borderColor: skillItem.skill.borderHex || undefined,
                            color: skillItem.skill.textHex || undefined,
                          }}
                        >
                          {skillItem.skill.iconUrl && (
                            <img 
                              src={skillItem.skill.iconUrl} 
                              alt={skillItem.skill.name}
                              className="w-3 h-3"
                            />
                          )}
                          {skillItem.skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Separator - Instagram Style */}
        <div className="border-t border-border mb-8"></div>

        {/* Projects Section */}
        <div>
          <div className="flex justify-center mb-6">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Projects
            </div>
          </div>
          
          {student.projects && student.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {student.projects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  hideStudentInfo={true}
                  isStudentApp={true}
                  showEditButton={true}
                  currentStudentId={student.id}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-border flex items-center justify-center">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground text-sm">You haven't shared any projects yet.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}