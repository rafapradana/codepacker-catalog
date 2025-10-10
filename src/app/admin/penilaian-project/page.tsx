"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAdminSession } from "@/lib/session"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { 
  IconSearch, 
  IconChevronDown, 
  IconClipboardCheck, 
  IconEye, 
  IconExternalLink,
  IconBrandGithub,
  IconStar,
  IconStarFilled,
  IconFilter,
  IconRefresh,
} from "@tabler/icons-react"

// Import sidebar components
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

// Import only types, not the server-side functions
import type { 
  ProjectWithGradingInfo,
  GradingMetric,
  ProjectGradeInput 
} from "@/lib/project-grading"

type SortOption = "newest" | "oldest" | "graded" | "ungraded" | "highest-score" | "lowest-score"
type FilterOption = "all" | "graded" | "ungraded"

interface GradingFormData {
  [metricId: string]: {
    score: number
    feedback: string
  }
}

export default function PenilaianProjectPage() {
  const [projects, setProjects] = useState<ProjectWithGradingInfo[]>([])
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithGradingInfo[]>([])
  const [gradingMetrics, setGradingMetrics] = useState<GradingMetric[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [ungradedCount, setUngradedCount] = useState(0)
  
  // Grading modal state
  const [selectedProject, setSelectedProject] = useState<ProjectWithGradingInfo | null>(null)
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false)
  const [gradingFormData, setGradingFormData] = useState<GradingFormData>({})
  const [overallFeedback, setOverallFeedback] = useState("")
  const [isSubmittingGrade, setIsSubmittingGrade] = useState(false)

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Filter and sort projects when dependencies change
  useEffect(() => {
    filterAndSortProjects()
  }, [projects, searchQuery, sortBy, filterBy])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch data from API endpoints instead of server functions
      const [projectsResponse, metricsResponse, ungradedCountResponse] = await Promise.all([
        fetch('/api/grading'),
        fetch('/api/grading/metrics'),
        fetch('/api/grading/ungraded-count'),
      ])
      
      if (!projectsResponse.ok || !metricsResponse.ok || !ungradedCountResponse.ok) {
        throw new Error('Failed to fetch data')
      }
      
      const [projectsData, metricsData, ungradedCountData] = await Promise.all([
        projectsResponse.json(),
        metricsResponse.json(),
        ungradedCountResponse.json(),
      ])
      
      setProjects(projectsData)
      setGradingMetrics(metricsData)
      setUngradedCount(ungradedCountData.count)
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Gagal memuat data project")
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortProjects = () => {
    let filtered = [...projects]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(query) ||
        project.student.fullName.toLowerCase().includes(query) ||
        project.student.user.username.toLowerCase().includes(query) ||
        project.student.class?.name.toLowerCase().includes(query) ||
        project.category?.name.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (filterBy === "graded") {
      filtered = filtered.filter(project => project.projectGrade)
    } else if (filterBy === "ungraded") {
      filtered = filtered.filter(project => !project.projectGrade)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "graded":
          if (a.projectGrade && !b.projectGrade) return -1
          if (!a.projectGrade && b.projectGrade) return 1
          return 0
        case "ungraded":
          if (!a.projectGrade && b.projectGrade) return -1
          if (a.projectGrade && !b.projectGrade) return 1
          return 0
        case "highest-score":
          const scoreA = a.projectGrade?.totalScore || 0
          const scoreB = b.projectGrade?.totalScore || 0
          return scoreB - scoreA
        case "lowest-score":
          const scoreA2 = a.projectGrade?.totalScore || 0
          const scoreB2 = b.projectGrade?.totalScore || 0
          return scoreA2 - scoreB2
        default:
          return 0
      }
    })

    setFilteredProjects(filtered)
  }

  const openGradingModal = (project: ProjectWithGradingInfo) => {
    setSelectedProject(project)
    
    // Initialize form data with existing grades if available
    const initialFormData: GradingFormData = {}
    gradingMetrics.forEach(metric => {
      initialFormData[metric.id] = {
        score: 0,
        feedback: ""
      }
    })
    
    setGradingFormData(initialFormData)
    setOverallFeedback(project.projectGrade?.feedback || "")
    setIsGradingModalOpen(true)
  }

  const handleGradeSubmit = async () => {
    if (!selectedProject) return

    try {
      setIsSubmittingGrade(true)
      
      // Get admin session to get the actual admin ID
      const adminSession = getAdminSession()
      if (!adminSession) {
        toast.error("Sesi admin tidak ditemukan. Silakan login kembali.")
        return
      }
      
      const gradeDetails = Object.entries(gradingFormData).map(([metricId, data]) => ({
        metricId,
        score: data.score,
        feedback: data.feedback || undefined,
      }))

      const gradeInput: ProjectGradeInput = {
        projectId: selectedProject.id,
        gradedBy: adminSession.userId, // Use actual admin ID from session
        gradeDetails,
        overallFeedback: overallFeedback || undefined,
      }

      // Submit grade via API instead of server function
      const response = await fetch('/api/grading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gradeInput),
      })

      if (!response.ok) {
        throw new Error('Failed to submit grade')
      }
      
      toast.success("Penilaian berhasil disimpan")
      setIsGradingModalOpen(false)
      
      // Reload data to reflect changes
      await loadData()
    } catch (error) {
      console.error("Error submitting grade:", error)
      toast.error("Gagal menyimpan penilaian")
    } finally {
      setIsSubmittingGrade(false)
    }
  }

  const updateGradingFormData = (metricId: string, field: 'score' | 'feedback', value: number | string) => {
    setGradingFormData(prev => ({
      ...prev,
      [metricId]: {
        ...prev[metricId],
        [field]: value,
      }
    }))
  }

  const calculateTotalScore = () => {
    try {
      return Object.entries(gradingFormData).reduce((total, [metricId, data]) => {
        const metric = gradingMetrics.find(m => m.id === metricId)
        if (metric && !isNaN(data.score)) {
          return total + (data.score * metric.weight)
        }
        return total
      }, 0)
    } catch (error) {
      console.error('Error calculating total score:', error)
      return 0
    }
  }

  const calculateMaxPossibleScore = () => {
    try {
      return gradingMetrics.reduce((total, metric) => {
        if (metric && !isNaN(metric.maxScore) && !isNaN(metric.weight)) {
          return total + (metric.maxScore * metric.weight)
        }
        return total
      }, 0)
    } catch (error) {
      console.error('Error calculating max possible score:', error)
      return 1 // Return 1 to avoid division by zero
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  const getGradeColor = (grade?: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800 border-green-200'
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'D': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'F': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat data project...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="container mx-auto px-4 py-4 space-y-4">
          {/* Header */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Penilaian Project Siswa</h1>
              <p className="text-sm text-muted-foreground">
                Kelola dan berikan penilaian untuk project siswa
              </p>
            </div>
            <Button onClick={loadData} variant="outline" size="sm">
              <IconRefresh className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>

          {/* Stats Cards - Full Width Theme-Aware Layout */}
          <div className="flex flex-wrap gap-2 justify-start w-full">
            <div className="flex items-center justify-between flex-1 min-w-[200px] px-4 py-2 bg-card rounded-lg border border-border">
              <span className="text-sm font-medium text-foreground">Total Project</span>
              <span className="text-lg font-bold text-foreground">{projects.length}</span>
            </div>
            <div className="flex items-center justify-between flex-1 min-w-[200px] px-4 py-2 bg-card rounded-lg border border-border">
              <span className="text-sm font-medium text-red-600">Belum Dinilai</span>
              <span className="text-lg font-bold text-red-600">{ungradedCount}</span>
            </div>
            <div className="flex items-center justify-between flex-1 min-w-[200px] px-4 py-2 bg-card rounded-lg border border-border">
              <span className="text-sm font-medium text-green-600">Sudah Dinilai</span>
              <span className="text-lg font-bold text-green-600">{projects.length - ungradedCount}</span>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari project, nama siswa, username, atau kelas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
                <SelectTrigger className="w-[140px]">
                  <IconFilter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="graded">Sudah Dinilai</SelectItem>
                  <SelectItem value="ungraded">Belum Dinilai</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                  <IconChevronDown className="h-4 w-4 ml-2" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Terbaru</SelectItem>
                  <SelectItem value="oldest">Terlama</SelectItem>
                  <SelectItem value="graded">Sudah Dinilai</SelectItem>
                  <SelectItem value="ungraded">Belum Dinilai</SelectItem>
                  <SelectItem value="highest-score">Nilai Tertinggi</SelectItem>
                  <SelectItem value="lowest-score">Nilai Terendah</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Projects Table */}
          <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Siswa</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Waktu Upload</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="text-muted-foreground">
                            {searchQuery || filterBy !== "all" 
                              ? "Tidak ada project yang sesuai dengan filter"
                              : "Belum ada project yang terdaftar"
                            }
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {project.thumbnailUrl && (
                                <img
                                  src={project.thumbnailUrl}
                                  alt={project.title}
                                  className="h-10 w-10 rounded-md object-cover flex-shrink-0"
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="font-medium truncate">{project.title}</div>
                                {project.description && (
                                  <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                    {project.description.length > 50 
                                      ? `${project.description.substring(0, 50)}...` 
                                      : project.description
                                    }
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage src={project.student.profilePhotoUrl} />
                                <AvatarFallback>
                                  {project.student.fullName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium truncate">{project.student.fullName}</div>
                                <div className="text-sm text-muted-foreground truncate">
                                  @{project.student.user.username}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {project.student.class?.name || (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {project.projectGrade ? (
                              <div className="flex items-center gap-2">
                                <Badge className={getGradeColor(project.projectGrade.grade)}>
                                  {project.projectGrade.grade}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {project.projectGrade.totalScore.toFixed(1)}/{project.projectGrade.maxPossibleScore.toFixed(1)}
                                </span>
                              </div>
                            ) : (
                              <Badge variant="outline" className="text-orange-600 border-orange-200">
                                Belum Dinilai
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatDate(project.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                >
                                  <IconChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    openGradingModal(project);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <IconClipboardCheck className="h-4 w-4 mr-2" />
                                  {project.projectGrade ? "Edit Nilai" : "Beri Nilai"}
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                                    <IconBrandGithub className="h-4 w-4 mr-2" />
                                    Lihat GitHub
                                  </a>
                                </DropdownMenuItem>
                                {project.liveDemoUrl && (
                                  <DropdownMenuItem asChild>
                                    <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                                      <IconExternalLink className="h-4 w-4 mr-2" />
                                      Lihat Demo
                                    </a>
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

          {/* Grading Modal */}
          <Dialog open={isGradingModalOpen} onOpenChange={setIsGradingModalOpen}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {selectedProject?.projectGrade ? "Edit Penilaian" : "Beri Penilaian"}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Project: <span className="font-medium text-foreground">{selectedProject?.title}</span> - {selectedProject?.student.fullName}
                </DialogDescription>
              </DialogHeader>

              {selectedProject && (
                <div className="space-y-4">
                  {/* Project Info - Compact Version */}
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Siswa:</span>
                        <span className="text-sm font-medium">{selectedProject.student.fullName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Kelas:</span>
                        <span className="text-sm">{selectedProject.student.class?.name || "Tidak ada kelas"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Kategori:</span>
                        <span className="text-sm">{selectedProject.category?.name || "Tidak ada kategori"}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                          <IconBrandGithub className="h-4 w-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                      {selectedProject.liveDemoUrl && (
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <a href={selectedProject.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                            <IconExternalLink className="h-4 w-4 mr-2" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Grading Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Kriteria Penilaian</CardTitle>
                      <CardDescription>
                        Berikan skor untuk setiap kriteria (1-10) dan feedback opsional
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {gradingMetrics.map((metric) => (
                        <div key={metric.id} className="space-y-3 p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <Label className="text-sm font-medium">{metric.name}</Label>
                              {metric.description && (
                                <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                Bobot: {metric.weight}x
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Max: {metric.maxScore}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <Label className="text-sm font-medium">Skor (1-{metric.maxScore})</Label>
                              <Select
                                value={gradingFormData[metric.id]?.score?.toString() || "0"}
                                onValueChange={(value) => updateGradingFormData(metric.id, 'score', parseInt(value))}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Pilih skor" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: metric.maxScore }, (_, i) => i + 1).map((score) => (
                                    <SelectItem key={score} value={score.toString()}>
                                      {score} - {score === 10 ? 'Sangat Baik' : score >= 8 ? 'Baik' : score >= 6 ? 'Cukup' : score >= 4 ? 'Kurang' : 'Sangat Kurang'}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Feedback (Opsional)</Label>
                              <Input
                                placeholder="Berikan feedback untuk kriteria ini..."
                                value={gradingFormData[metric.id]?.feedback || ""}
                                onChange={(e) => updateGradingFormData(metric.id, 'feedback', e.target.value)}
                                className="text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Overall Feedback and Summary */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Feedback Keseluruhan (Opsional)</Label>
                      <Textarea
                        placeholder="Berikan feedback keseluruhan untuk project ini..."
                        value={overallFeedback}
                        onChange={(e) => setOverallFeedback(e.target.value)}
                        rows={3}
                        className="text-sm"
                      />
                    </div>
                    
                    {/* Score Summary */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            {calculateTotalScore().toFixed(1)}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Skor</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-muted-foreground">
                            {calculateMaxPossibleScore().toFixed(1)}
                          </div>
                          <div className="text-sm text-muted-foreground">Skor Maksimal</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {calculateMaxPossibleScore() > 0 
                              ? ((calculateTotalScore() / calculateMaxPossibleScore()) * 100).toFixed(1)
                              : '0.0'
                            }%
                          </div>
                          <div className="text-sm text-muted-foreground">Persentase</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsGradingModalOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleGradeSubmit} disabled={isSubmittingGrade}>
                  {isSubmittingGrade ? "Menyimpan..." : "Simpan Penilaian"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
            </div>
          </SidebarInset>
        </SidebarProvider>
      )
    }