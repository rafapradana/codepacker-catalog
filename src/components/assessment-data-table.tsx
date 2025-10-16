'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IconSearch, IconEye, IconEdit, IconStar, IconStarFilled, IconBrandGithub, IconExternalLink, IconClipboardCheck, IconChevronDown, IconDots } from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { AssessmentModal } from './assessment-modal'
import { ProjectForAssessment } from '@/lib/assessment-types'

type FilterOption = "all" | "assessed" | "unassessed"
type SortOption = "created-desc" | "created-asc" | "name-asc" | "name-desc" | "score-desc" | "score-asc"

export function AssessmentDataTable() {
  const [projects, setProjects] = useState<ProjectForAssessment[]>([])
  const [filteredProjects, setFilteredProjects] = useState<ProjectForAssessment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [sortBy, setSortBy] = useState<SortOption>("created-desc")
  const [selectedProject, setSelectedProject] = useState<ProjectForAssessment | null>(null)
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false)

  // Load projects data
  const loadProjects = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/assessments')
      if (!response.ok) throw new Error('Failed to fetch projects')
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  // Filter and sort projects
  useEffect(() => {
    let filtered = [...projects]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.student.class?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    if (filterBy === "assessed") {
      filtered = filtered.filter(project => project.assessment !== null)
    } else if (filterBy === "unassessed") {
      filtered = filtered.filter(project => project.assessment === null)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "created-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "created-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "name-asc":
          return a.title.localeCompare(b.title)
        case "name-desc":
          return b.title.localeCompare(a.title)
        case "score-desc":
          return (b.assessment?.totalScore || 0) - (a.assessment?.totalScore || 0)
        case "score-asc":
          return (a.assessment?.totalScore || 0) - (b.assessment?.totalScore || 0)
        default:
          return 0
      }
    })

    setFilteredProjects(filtered)
  }, [projects, searchQuery, filterBy, sortBy])

  const handleAssessProject = (project: ProjectForAssessment) => {
    setSelectedProject(project)
    setIsAssessmentModalOpen(true)
  }

  const handleAssessmentComplete = () => {
    setIsAssessmentModalOpen(false)
    setSelectedProject(null)
    loadProjects() // Reload data after assessment
  }

  const getStatusBadge = (project: ProjectForAssessment) => {
    if (project.assessment) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          Sudah Dinilai
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
        Belum Dinilai
      </Badge>
    )
  }

  const getGradeBadge = (grade: string) => {
    const gradeColors = {
      'A': 'bg-green-100 text-green-800 border-green-200',
      'B': 'bg-blue-100 text-blue-800 border-blue-200',
      'C': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'D': 'bg-orange-100 text-orange-800 border-orange-200',
      'E': 'bg-red-100 text-red-800 border-red-200',
    }
    
    return (
      <Badge className={gradeColors[grade as keyof typeof gradeColors] || 'bg-gray-100 text-gray-800 border-gray-200'}>
        {grade}
      </Badge>
    )
  }

  const renderStars = (score: number) => {
    const maxScore = 100
    const stars = Math.round((score / maxScore) * 5)
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star}>
            {star <= stars ? (
              <IconStarFilled className="h-4 w-4 text-yellow-400" />
            ) : (
              <IconStar className="h-4 w-4 text-gray-300" />
            )}
          </div>
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari project atau siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Project</SelectItem>
              <SelectItem value="unassessed">Belum Dinilai</SelectItem>
              <SelectItem value="assessed">Sudah Dinilai</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Urutkan <IconChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("created-desc")}>
                Terbaru
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("created-asc")}>
                Terlama
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name-asc")}>
                Nama A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name-desc")}>
                Nama Z-A
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("score-desc")}>
                Skor Tertinggi
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("score-asc")}>
                Skor Terendah
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <IconClipboardCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Project</p>
              <p className="text-2xl font-bold">{projects.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <IconStarFilled className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sudah Dinilai</p>
              <p className="text-2xl font-bold">
                {projects.filter(p => p.assessment).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <IconStar className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Belum Dinilai</p>
              <p className="text-2xl font-bold">
                {projects.filter(p => !p.assessment).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="border rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Project</th>
                <th className="text-left p-4 font-medium">Siswa</th>
                <th className="text-left p-4 font-medium">Kelas</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Nilai</th>
                <th className="text-left p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-muted-foreground">
                    {searchQuery || filterBy !== "all" 
                      ? "Tidak ada project yang sesuai dengan filter"
                      : "Belum ada project yang tersedia"
                    }
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                          {project.thumbnailUrl ? (
                            <img 
                              src={project.thumbnailUrl} 
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <IconClipboardCheck className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{project.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.description || "Tidak ada deskripsi"}
                          </p>
                          {project.category && (
                            <Badge variant="outline" className="mt-1">
                              {project.category.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={project.student.profilePhotoUrl || undefined} />
                          <AvatarFallback>
                            {project.student.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{project.student.fullName}</p>
                          <p className="text-sm text-muted-foreground">@{project.student.user.username}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      {project.student.class ? (
                        <Badge variant="outline">{project.student.class.name}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    
                    <td className="p-4">
                      {getStatusBadge(project)}
                    </td>
                    
                    <td className="p-4">
                      {project.assessment ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getGradeBadge(project.assessment.finalGrade)}
                            <span className="text-sm text-muted-foreground">
                              {project.assessment.totalScore}/100
                            </span>
                          </div>
                          {renderStars(project.assessment.totalScore)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <IconDots className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/kelola-project/${project.id}`} className="flex items-center gap-2">
                              <IconEye className="h-4 w-4" />
                              Lihat Detail
                            </Link>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem asChild>
                            <a 
                              href={project.githubUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <IconBrandGithub className="h-4 w-4" />
                              Lihat GitHub
                            </a>
                          </DropdownMenuItem>
                          
                          {project.liveDemoUrl && (
                            <DropdownMenuItem asChild>
                              <a 
                                href={project.liveDemoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <IconExternalLink className="h-4 w-4" />
                                Lihat Demo
                              </a>
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem 
                            onClick={() => handleAssessProject(project)}
                            className="flex items-center gap-2"
                          >
                            <IconClipboardCheck className="h-4 w-4" />
                            {project.assessment ? "Edit Penilaian" : "Beri Nilai"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assessment Modal */}
      {selectedProject && (
        <AssessmentModal
          project={selectedProject}
          isOpen={isAssessmentModalOpen}
          onClose={() => setIsAssessmentModalOpen(false)}
          onAssessmentComplete={handleAssessmentComplete}
        />
      )}
    </div>
  )
}