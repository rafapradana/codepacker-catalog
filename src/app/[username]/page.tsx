'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Github, Linkedin, Calendar,MapPin } from 'lucide-react'
import { ProjectCard } from '@/components/project-card'
import { GuestNavbar } from '@/components/guest-navbar'
import { ProfileWithOnlineStatus } from '@/components/ui/online-status-dot'

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
      bgHex: string | null
      borderHex: string | null
      textHex: string | null
    }
  }>
  projects: Array<{
    id: string
    title: string
    description: string | null
    thumbnailUrl: string | null
    githubUrl: string | null
    liveDemoUrl: string | null
    createdAt: string
    category: {
      name: string
      bgHex: string | null
      borderHex: string | null
      textHex: string | null
    } | null
    projectTechstacks: Array<{
      techstack: {
        id: string
        name: string
        iconUrl: string | null
        bgHex: string | null
        borderHex: string | null
        textHex: string | null
      }
    }>
  }>
}

export default function StudentProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/profile/${username}`)
        if (!response.ok) {
          throw new Error('Student not found')
        }
        const data = await response.json()
        setStudent(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchStudent()
    }
  }, [username])

  if (loading) {
    return (
      <>
        <GuestNavbar />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </>
    )
  }

  if (error || !student) {
    return (
      <>
        <GuestNavbar />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Profile Not Found</h1>
            <p className="text-muted-foreground">{error || 'Student profile not found'}</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <GuestNavbar />
      <main className="container mx-auto px-4 lg:px-16 xl:px-24 py-8 pt-24 bg-background min-h-screen">
        {/* Profile Header - Instagram Style */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 mb-8">
            {/* Profile Picture */}
            <div className="flex justify-center sm:justify-start flex-shrink-0">
              <ProfileWithOnlineStatus 
                userId={student.id}
                dotSize="lg"
                dotPosition="bottom-right"
              >
                <Avatar className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 ring-2 ring-border">
                  <AvatarImage src={student.profilePhotoUrl || ''} alt={student.fullName} />
                  <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                    {student.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </ProfileWithOnlineStatus>
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
                  <div className="font-semibold text-lg text-foreground">{student.projects.length}</div>
                  <div className="text-sm text-muted-foreground">projects</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-foreground">{student.studentSkills.length}</div>
                  <div className="text-sm text-muted-foreground">skills</div>
                </div>
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
                  {student.studentSkills.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                        {student.studentSkills.map(({ skill }) => (
                          <Badge
                            key={skill.id}
                            variant="secondary"
                            className="px-3 py-1.5 text-xs font-medium"
                            style={{
                              backgroundColor: skill.bgHex || undefined,
                              borderColor: skill.borderHex || undefined,
                              color: skill.textHex || undefined,
                            }}
                          >
                            {skill.iconUrl && (
                              <img src={skill.iconUrl} alt={skill.name} className="w-3 h-3 mr-1.5" />
                            )}
                            {skill.name}
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
            
            {student.projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {student.projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={{
                      ...project,
                      updatedAt: project.createdAt, // Use createdAt as updatedAt since API doesn't return updatedAt
                      githubUrl: project.githubUrl || '', // Ensure githubUrl is never null
                      category: project.category ? {
                        id: 'temp-category-id', // Temporary ID since API doesn't return category ID
                        name: project.category.name,
                        bgHex: project.category.bgHex || '#000000',
                        borderHex: project.category.borderHex || '#000000',
                        textHex: project.category.textHex || '#ffffff',
                      } : null,
                      projectTechstacks: project.projectTechstacks.map((item, index) => ({
                        id: `temp-techstack-${index}`, // Temporary ID since API doesn't return relation ID
                        techstack: {
                          id: item.techstack.id,
                          name: item.techstack.name,
                          iconUrl: item.techstack.iconUrl,
                          bgHex: item.techstack.bgHex || '#000000',
                          borderHex: item.techstack.borderHex || '#000000',
                          textHex: item.techstack.textHex || '#ffffff',
                        }
                      })),
                      student: {
                        id: student.id,
                        fullName: student.fullName,
                        profilePhotoUrl: student.profilePhotoUrl,
                        classId: student.class?.name ? 'temp-class-id' : null, // Temporary classId since API doesn't return it
                        className: student.class?.name || null,
                      },
                      projectMedia: [], // Empty array since API doesn't return projectMedia
                    }}
                    hideStudentInfo={true} // Hide student info on their own profile page
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-border flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground text-sm">This student hasn't shared any projects yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}