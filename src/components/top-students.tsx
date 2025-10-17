"use client"

import * as React from "react"
import { StudentCard } from "@/components/student-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconArrowRight, IconStar, IconTrophy, IconUsers } from "@tabler/icons-react"
import Link from "next/link"
import { TopStudent } from "@/lib/top-content"

interface TopStudentsProps {
  className?: string
}

export function TopStudents({ className }: TopStudentsProps) {
  const [students, setStudents] = React.useState<TopStudent[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchTopStudents = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/top-students')
        
        if (!response.ok) {
          throw new Error('Failed to fetch top students')
        }
        
        const data = await response.json()
        
        if (data.success) {
          setStudents(data.data)
        } else {
          throw new Error(data.error || 'Failed to fetch top students')
        }
      } catch (error) {
        console.error('Error fetching top students:', error)
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTopStudents()
  }, [])

  if (error) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
              <IconUsers className="h-4 w-4" />
              Error loading top students
            </div>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-16 md:py-32 bg-zinc-50 dark:bg-transparent ${className}`}>
      <div className="@container mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 text-secondary-foreground text-sm font-medium mb-4">
            <IconUsers className="h-4 w-4" />
            Top Students
          </div>
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl mb-4">
            Siswa Terbaik
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Kenali siswa-siswa terbaik CodePacker yang telah menunjukkan dedikasi, 
            kreativitas, dan prestasi luar biasa dalam dunia programming.
          </p>
        </div>

        {/* Students Grid */}
        {isLoading ? (
          <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 md:mt-16">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-muted rounded-lg h-80 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : students.length > 0 ? (
          <>
            <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 md:mt-16 mb-8">
              {students.map((student, index) => (
                <div key={student.id} className="relative group shadow-zinc-950/5">
                  {/* Ranking Badge - Centered at top */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg
                      ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' : 
                        'bg-gradient-to-br from-amber-600 to-amber-800'}
                    `}>
                      {index + 1}
                    </div>
                  </div>

                  <StudentCard
                    student={{
                      id: student.id,
                      fullName: student.fullName,
                      bio: student.bio,
                      profilePhotoUrl: student.profilePhotoUrl,
                      githubUrl: student.githubUrl,
                      linkedinUrl: student.linkedinUrl,
                      user: student.user,
                      class: student.class,
                      skills: student.skills,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <Link href="/students">
                <Button size="lg" variant="default" className="group bg-primary text-primary-foreground hover:bg-primary/90">
                  Lihat Semua Siswa
                  <IconArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-4">
              <IconUsers className="h-4 w-4" />
              No students found
            </div>
            <p className="text-muted-foreground">
              Belum ada siswa yang tersedia saat ini.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}