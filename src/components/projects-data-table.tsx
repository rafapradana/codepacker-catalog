"use client"

import * as React from "react"
import { IconPlus, IconEdit, IconTrash, IconUpload, IconX, IconExternalLink, IconBrandGithub, IconEye, IconCalendar, IconChevronDown, IconSearch, IconCode } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { ProjectWithDetails } from "@/lib/projects"
import { Student } from "@/lib/students"
import { Category } from "@/lib/categories"
import { TechStack } from "@/lib/techstacks"
import { ProjectCard } from "@/components/project-card"
import { getStudentSession } from "@/lib/session"

interface ProjectFormData {
  studentId: string
  title: string
  description: string
  thumbnailUrl: string | null
  githubUrl: string
  liveDemoUrl: string
  categoryId: string | null
}

interface ProjectMedia {
  id: string
  mediaUrl: string
  mediaType: string
  createdAt?: Date
  file?: File // Add file property for new uploads
}

interface ProjectTechstack {
  id: string
  techstack: {
    id: string
    name: string | null
    iconUrl: string | null
    bgHex: string | null
    borderHex: string | null
    textHex: string | null
  } | null
}

type SortOption = "updated-desc" | "updated-asc" | "created-desc" | "created-asc" | "name-asc" | "name-desc"

export function ProjectsDataTable() {
  const [projects, setProjects] = React.useState<ProjectWithDetails[]>([])
  const [students, setStudents] = React.useState<Student[]>([])
  const [categories, setCategories] = React.useState<Category[]>([])
  const [techstacks, setTechstacks] = React.useState<TechStack[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false)
  const [editingProject, setEditingProject] = React.useState<ProjectWithDetails | null>(null)
  const [viewingProject, setViewingProject] = React.useState<ProjectWithDetails | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  
  // Search and sort state
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortBy, setSortBy] = React.useState<SortOption>("updated-desc")
  
  // Form state
  const [formData, setFormData] = React.useState<ProjectFormData>({
    studentId: "",
    title: "",
    description: "",
    thumbnailUrl: null,
    githubUrl: "",
    liveDemoUrl: "",
    categoryId: null,
  })
  
  // File upload state
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [filePreview, setFilePreview] = React.useState<string | null>(null)
  
  // Media management state
  const [projectMedia, setProjectMedia] = React.useState<ProjectMedia[]>([])
  const [newMediaType, setNewMediaType] = React.useState<'image' | 'video'>('image')
  const [selectedMediaFile, setSelectedMediaFile] = React.useState<File | null>(null)
  const [mediaFilePreview, setMediaFilePreview] = React.useState<string | null>(null)

  
  // Techstack management state
  const [projectTechstacks, setProjectTechstacks] = React.useState<ProjectTechstack[]>([])
  const [selectedTechstackId, setSelectedTechstackId] = React.useState<string>("")

  // Fetch data on component mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, studentsRes, categoriesRes, techstacksRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/students'),
          fetch('/api/categories'),
          fetch('/api/techstacks')
        ])

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json()
          setProjects(projectsData.projects || [])
        }

        if (studentsRes.ok) {
          const studentsData = await studentsRes.json()
          setStudents(studentsData)
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData)
        }

        if (techstacksRes.ok) {
          const techstacksData = await techstacksRes.json()
          setTechstacks(techstacksData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Gagal memuat data')
      }
    }

    fetchData()
  }, [])

  // Filter and sort projects
  const filteredProjects = (projects || []).filter(project => {
    if (!searchQuery) return true
    
    const query = searchQuery.toLowerCase()
    return (
      project.title.toLowerCase().includes(query) ||
      (project.description?.toLowerCase().includes(query) || false) ||
      (project.student?.fullName.toLowerCase().includes(query) || false) ||
      (project.category?.name.toLowerCase().includes(query) || false)
    )
  })

  const sortedProjects = React.useMemo(() => {
    const sorted = [...filteredProjects]
    
    switch (sortBy) {
      case "name-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      case "name-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title))
      case "created-asc":
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      case "created-desc":
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case "updated-asc":
        return sorted.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
      case "updated-desc":
      default:
        return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    }
  }, [filteredProjects, sortBy])

  const getSortLabel = (sortOption: SortOption): string => {
    switch (sortOption) {
      case "updated-desc": return "Terbaru Diperbarui"
      case "updated-asc": return "Terlama Diperbarui"
      case "created-desc": return "Terbaru Dibuat"
      case "created-asc": return "Terlama Dibuat"
      case "name-asc": return "Nama A-Z"
      case "name-desc": return "Nama Z-A"
      default: return "Terbaru Diperbarui"
    }
  }

  const resetForm = () => {
    setFormData({
      studentId: "",
      title: "",
      description: "",
      thumbnailUrl: null,
      githubUrl: "",
      liveDemoUrl: "",
      categoryId: null,
    })
    setSelectedFile(null)
    setFilePreview(null)
    setProjectMedia([])
    setProjectTechstacks([])
    setSelectedMediaFile(null)
    setMediaFilePreview(null)
    setSelectedTechstackId("")
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("File harus berupa gambar")
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB")
        return
      }
      
      setSelectedFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        setFilePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadThumbnail = async (): Promise<string | null> => {
    if (!selectedFile) return null

    const uploadFormData = new FormData()
    uploadFormData.append('file', selectedFile)
    uploadFormData.append('userId', formData.studentId)

    try {
      const response = await fetch('/api/upload/project-thumbnails', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()
      return result.url
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Gagal mengupload thumbnail')
      return null
    }
  }

  const handleCreate = async () => {
    if (!formData.studentId || !formData.title || !formData.githubUrl) {
      toast.error("Mohon lengkapi field yang wajib diisi")
      return
    }

    // Get student session for authentication
    const session = getStudentSession()
    if (!session) {
      toast.error("Please log in to create a project")
      return
    }

    setIsLoading(true)
    try {
      let thumbnailUrl = formData.thumbnailUrl

      // Upload thumbnail if file is selected
      if (selectedFile) {
        thumbnailUrl = await uploadThumbnail()
        if (!thumbnailUrl) {
          setIsLoading(false)
          return
        }
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.id}`,
        },
        body: JSON.stringify({
          ...formData,
          thumbnailUrl,
          mediaUrls: projectMedia.map(m => m.mediaUrl),
          techstackIds: projectTechstacks.map(t => t.techstack?.id).filter(Boolean),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create project')
      }

      const result = await response.json()
      
      // Add media and techstacks to the new project
      if (result.id) {
        await Promise.all([
          ...projectMedia.map(media => 
            fetch(`/api/projects/${result.id}/media/direct`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                mediaUrl: media.mediaUrl,
                mediaType: media.mediaType
              }),
            })
          ),
          ...projectTechstacks.map(techstack => 
            fetch(`/api/projects/${result.id}/techstacks`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ techstackId: techstack.techstack?.id }),
            })
          ),
        ])
      }

      toast.success("Project berhasil dibuat")
      setIsCreateDialogOpen(false)
      resetForm()
      
      // Refresh data
      const projectsResponse = await fetch('/api/projects')
      if (projectsResponse.ok) {
        const updatedProjects = await projectsResponse.json()
        setProjects(updatedProjects.projects || [])
      }
    } catch (error) {
      console.error('Create error:', error)
      toast.error(error instanceof Error ? error.message : "Gagal membuat project")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (project: ProjectWithDetails) => {
    setEditingProject(project)
    setFormData({
      studentId: project.student?.id || "",
      title: project.title,
      description: project.description || "",
      thumbnailUrl: project.thumbnailUrl || null,
      githubUrl: project.githubUrl,
      liveDemoUrl: project.liveDemoUrl || "",
      categoryId: project.category?.id || null,
    })
    
    // Set existing media and techstacks
    setProjectMedia(project.media || [])
    setProjectTechstacks(project.techstacks || [])
    
    if (project.thumbnailUrl) {
      setFilePreview(project.thumbnailUrl)
    }
    
    setIsEditDialogOpen(true)
  }

  const handleViewDetail = (project: ProjectWithDetails) => {
    setViewingProject(project)
    setIsDetailDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingProject || !formData.title || !formData.githubUrl) {
      toast.error("Mohon lengkapi field yang wajib diisi")
      return
    }

    setIsLoading(true)
    try {
      let thumbnailUrl = formData.thumbnailUrl

      // Upload new thumbnail if file is selected
      if (selectedFile) {
        thumbnailUrl = await uploadThumbnail()
        if (!thumbnailUrl) {
          setIsLoading(false)
          return
        }
      }

      const response = await fetch(`/api/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          thumbnailUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update project')
      }

      // Update media and techstacks
      await updateProjectMediaAndTechstacks(editingProject.id)

      toast.success("Project berhasil diupdate")
      setIsEditDialogOpen(false)
      resetForm()
      setEditingProject(null)
      
      // Refresh data
      const projectsResponse = await fetch('/api/projects')
      if (projectsResponse.ok) {
        const updatedProjects = await projectsResponse.json()
        setProjects(updatedProjects.projects || [])
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error(error instanceof Error ? error.message : "Gagal mengupdate project")
    } finally {
      setIsLoading(false)
    }
  }

  const updateProjectMediaAndTechstacks = async (projectId: string) => {
    try {
      // Get current media and techstacks from server
      const [mediaResponse, techstacksResponse] = await Promise.all([
        fetch(`/api/projects/${projectId}/media`),
        fetch(`/api/projects/${projectId}/techstacks`)
      ])

      const currentMedia = mediaResponse.ok ? await mediaResponse.json() : []
      const currentTechstacks = techstacksResponse.ok ? await techstacksResponse.json() : []

      // Remove media that are no longer in the list
      const mediaToRemove = currentMedia.filter((current: any) => 
        !projectMedia.some(local => local.mediaUrl === current.mediaUrl)
      )
      
      for (const media of mediaToRemove) {
        await fetch(`/api/projects/${projectId}/media/${media.id}`, {
          method: 'DELETE'
        })
      }

      // Add new media
      const mediaToAdd = projectMedia.filter(local => 
        !currentMedia.some((current: any) => current.mediaUrl === local.mediaUrl)
      )
      
      for (const media of mediaToAdd) {
        await fetch(`/api/projects/${projectId}/media/direct`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mediaUrl: media.mediaUrl,
            mediaType: media.mediaType
          })
        })
      }

      // Remove techstacks that are no longer in the list
      const techstacksToRemove = currentTechstacks.filter((current: any) => 
        !projectTechstacks.some(local => local.techstack?.id === current.techstack?.id)
      )
      
      for (const techstack of techstacksToRemove) {
        await fetch(`/api/projects/${projectId}/techstacks/${techstack.techstack.id}`, {
          method: 'DELETE'
        })
      }

      // Add new techstacks
      const techstacksToAdd = projectTechstacks.filter(local => 
        !currentTechstacks.some((current: any) => current.techstack?.id === local.techstack?.id)
      )
      
      for (const techstack of techstacksToAdd) {
        await fetch(`/api/projects/${projectId}/techstacks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ techstackId: techstack.techstack?.id })
        })
      }
    } catch (error) {
      console.error('Error updating media and techstacks:', error)
      // Don't throw error to prevent blocking the main update
    }
  }

  const handleDelete = async (projectId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete project')
      }

      toast.success("Project berhasil dihapus")
      setProjects((projects || []).filter(p => p.id !== projectId))
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(error instanceof Error ? error.message : "Gagal menghapus project")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMediaFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedMediaFile(file)
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setMediaFilePreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setMediaFilePreview(null)
      }
    }
  }

  const uploadMedia = async (file: File, mediaType: 'image' | 'video'): Promise<string | null> => {
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('mediaType', mediaType)
    // Generate a temporary UUID for testing
    uploadFormData.append('userId', '550e8400-e29b-41d4-a716-446655440000')

    try {
      const response = await fetch('/api/upload/project-media', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()
      return result.url
    } catch (error) {
      console.error('Media upload error:', error)
      toast.error('Gagal mengupload media')
      return null
    }
  }

  const addMedia = async () => {
    if (!selectedMediaFile) {
      toast.error("Pilih file media terlebih dahulu")
      return
    }

    try {
      const mediaUrl = await uploadMedia(selectedMediaFile, newMediaType)
      if (!mediaUrl) return

      const newMedia: ProjectMedia = {
        id: Date.now().toString(),
        mediaUrl,
        mediaType: newMediaType,
      }

      setProjectMedia([...projectMedia, newMedia])
      setSelectedMediaFile(null)
      setMediaFilePreview(null)
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"][accept*="image/jpeg,image/png,image/webp,video/mp4,video/webm"]') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      
      toast.success("Media berhasil ditambahkan")
    } catch (error) {
      console.error('Add media error:', error)
      toast.error("Gagal menambahkan media")
    }
  }

  const removeMedia = (mediaId: string) => {
    setProjectMedia(projectMedia.filter(m => m.id !== mediaId))
  }

  const addTechstack = () => {
    if (!selectedTechstackId) {
      toast.error("Pilih techstack terlebih dahulu")
      return
    }

    // Check if techstack already added
    if (projectTechstacks.some(t => t.techstack?.id === selectedTechstackId)) {
      toast.error("Techstack sudah ditambahkan")
      return
    }

    const techstack = techstacks.find(t => t.id === selectedTechstackId)
    if (!techstack) return

    const newTechstack: ProjectTechstack = {
      id: Date.now().toString(),
      techstack: {
        id: techstack.id,
        name: techstack.name,
        iconUrl: techstack.iconUrl,
        bgHex: techstack.bgHex,
        borderHex: techstack.borderHex,
        textHex: techstack.textHex,
      }
    }

    setProjectTechstacks([...projectTechstacks, newTechstack])
    setSelectedTechstackId("")
  }

  const removeTechstack = (techstackId: string) => {
    setProjectTechstacks(projectTechstacks.filter(t => t.techstack?.id !== techstackId))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kelola Project Siswa</h1>
          <p className="text-muted-foreground">
            Kelola data project siswa dengan lengkap
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
          console.log('Dialog state changing:', open)
          setIsCreateDialogOpen(open)
          if (open) {
            resetForm()
          }
        }}>
          <DialogTrigger asChild>
            <Button 
              onClick={(e) => {
                e.preventDefault()
                console.log('Button clicked!')
                setIsCreateDialogOpen(true)
              }}
            >
              <IconPlus className="mr-2 h-4 w-4" />
              Tambah Project
            </Button>
          </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader className="space-y-3 pb-6 border-b">
                <DialogTitle className="text-xl font-semibold">Tambah Project Baru</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Isi form di bawah untuk menambah project siswa baru
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-foreground border-b pb-2">
                    Informasi Dasar
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentId" className="text-sm font-medium">
                        Siswa <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.studentId}
                        onValueChange={(value) => setFormData({ ...formData, studentId: value })}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Pilih siswa" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoryId" className="text-sm font-medium">Kategori</Label>
                      <Select
                        value={formData.categoryId || "no-category"}
                        onValueChange={(value) => setFormData({ ...formData, categoryId: value === "no-category" ? null : value })}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-category">Tidak ada kategori</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Judul Project <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Masukkan judul project"
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">Deskripsi</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Masukkan deskripsi project"
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </div>

                {/* URLs Section */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-foreground border-b pb-2">
                    URL & Links
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="githubUrl" className="text-sm font-medium">
                        GitHub URL <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="githubUrl"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/username/repo"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="liveDemoUrl" className="text-sm font-medium">Live Demo URL</Label>
                      <Input
                        id="liveDemoUrl"
                        value={formData.liveDemoUrl}
                        onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                        placeholder="https://example.com"
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Media Section */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-foreground border-b pb-2">
                    Media Project
                  </h3>
                  
                  {/* Thumbnail Upload */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Thumbnail Project</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="flex-1"
                      />
                      {filePreview && (
                        <div className="relative">
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0"
                            onClick={() => {
                              setSelectedFile(null)
                              setFilePreview(null)
                            }}
                          >
                            <IconX className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Media Management */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Media Tambahan</Label>
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Pilih File Media</Label>
                          <Input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                            onChange={handleMediaFileChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Tipe Media</Label>
                          <Select value={newMediaType} onValueChange={(value: 'image' | 'video') => setNewMediaType(value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="image">Image</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    
                    {/* Media Preview */}
                    {selectedMediaFile && (
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            File: {selectedMediaFile.name} ({(selectedMediaFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        </div>
                        {mediaFilePreview && (
                          <div className="relative">
                            <img
                              src={mediaFilePreview}
                              alt="Media Preview"
                              className="w-16 h-16 object-cover rounded"
                            />
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMediaFile(null)
                            setMediaFilePreview(null)
                            const fileInput = document.querySelector('input[type="file"][accept*="image/jpeg,image/png,image/webp,video/mp4,video/webm"]') as HTMLInputElement
                            if (fileInput) fileInput.value = ''
                          }}
                        >
                          <IconX className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    <Button 
                      type="button" 
                      onClick={addMedia} 
                      size="sm"
                      disabled={!selectedMediaFile}
                    >
                      <IconPlus className="mr-2 h-4 w-4" />
                      Tambah Media
                    </Button>
                    
                    {projectMedia.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Media yang Ditambahkan:</Label>
                        {projectMedia.map((media) => (
                          <div key={media.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                              <Badge variant={media.mediaType === 'image' ? 'default' : 'secondary'}>
                                {media.mediaType}
                              </Badge>
                              {media.mediaType === 'image' && (
                                <img
                                  src={media.mediaUrl}
                                  alt="Media"
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {media.mediaType === 'image' ? 'Gambar' : 'Video'}
                                </p>
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {media.mediaUrl}
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeMedia(media.id)}
                            >
                              <IconX className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Techstack Management */}
                <div className="space-y-2">
                  <Label>Techstack Project</Label>
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex gap-2">
                      <Select value={selectedTechstackId} onValueChange={setSelectedTechstackId}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Pilih techstack" />
                        </SelectTrigger>
                        <SelectContent>
                          {techstacks.map((techstack) => (
                            <SelectItem key={techstack.id} value={techstack.id}>
                              <div className="flex items-center gap-2">
                                {techstack.iconUrl && (
                                  <img src={techstack.iconUrl} alt={techstack.name} className="w-4 h-4" />
                                )}
                                {techstack.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" onClick={addTechstack} size="sm">
                        <IconPlus className="mr-2 h-4 w-4" />
                        Tambah
                      </Button>
                    </div>
                    
                    {projectTechstacks.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {projectTechstacks.map((techstack) => (
                          <Badge key={techstack.id} variant="outline" className="flex items-center gap-1">
                            {techstack.techstack?.iconUrl && (
                              <img src={techstack.techstack.iconUrl} alt={techstack.techstack.name || ''} className="w-3 h-3" />
                            )}
                            {techstack.techstack?.name}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 ml-1"
                              onClick={() => removeTechstack(techstack.techstack?.id || "")}
                            >
                              <IconX className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleCreate} disabled={isLoading}>
                  {isLoading ? "Menyimpan..." : "Simpan"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari project, siswa, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[200px] justify-between">
                {getSortLabel(sortBy)}
                <IconChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => setSortBy("updated-desc")}>
                Terbaru Diperbarui
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("updated-asc")}>
                Terlama Diperbarui
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("created-desc")}>
                Terbaru Dibuat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("created-asc")}>
                Terlama Dibuat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name-asc")}>
                Nama A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name-desc")}>
                Nama Z-A
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Projects Grid Layout - 3 cards per row */}
        {sortedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleViewDetail}
                isLoading={isLoading}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-lg font-medium mb-2">Belum ada data project</div>
            <p className="text-sm">Tambahkan project siswa untuk mulai mengelola data</p>
          </div>
        )}
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6 border-b">
            <DialogTitle className="text-xl font-semibold">Edit Project</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Edit informasi project siswa
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            {/* Informasi Dasar */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground border-b pb-2">
                Informasi Dasar
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-studentId" className="text-sm font-medium">Siswa *</Label>
                  <Select
                    value={formData.studentId}
                    onValueChange={(value) => setFormData({ ...formData, studentId: value })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Pilih siswa" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-categoryId" className="text-sm font-medium">Kategori</Label>
                  <Select
                    value={formData.categoryId || "no-category"}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value === "no-category" ? null : value })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-category">Tidak ada kategori</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-sm font-medium">Judul Project *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masukkan judul project"
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-sm font-medium">Deskripsi</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Masukkan deskripsi project"
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
            
            {/* URL & Links */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground border-b pb-2">
                URL & Links
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-githubUrl" className="text-sm font-medium">GitHub URL *</Label>
                  <Input
                    id="edit-githubUrl"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/repo"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-liveDemoUrl" className="text-sm font-medium">Live Demo URL</Label>
                  <Input
                    id="edit-liveDemoUrl"
                    value={formData.liveDemoUrl}
                    onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="h-10"
                  />
                </div>
              </div>
            </div>
            
            {/* Media Section */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground border-b pb-2">
                Media Project
              </h3>
              
              {/* Thumbnail Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Thumbnail Project</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex-1 h-10"
                  />
                  {filePreview && (
                    <div className="relative">
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={() => {
                          setSelectedFile(null)
                          setFilePreview(null)
                          setFormData({ ...formData, thumbnailUrl: null })
                        }}
                      >
                        <IconX className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Format yang didukung: JPG, PNG, WebP. Maksimal 5MB.
                </p>
              </div>
            </div>
            
            {/* Media Management */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground border-b pb-2">
                Media Project
              </h3>
              <div className="border rounded-lg p-6 space-y-6 bg-muted/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Pilih File Media</Label>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                      onChange={handleMediaFileChange}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tipe Media</Label>
                    <Select value={newMediaType} onValueChange={(value: 'image' | 'video') => setNewMediaType(value)}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Media Preview */}
                {selectedMediaFile && (
                  <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {selectedMediaFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedMediaFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    {mediaFilePreview && (
                      <div className="relative">
                        <img
                          src={mediaFilePreview}
                          alt="Media Preview"
                          className="w-16 h-16 object-cover rounded-md border"
                        />
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedMediaFile(null)
                        setMediaFilePreview(null)
                        const fileInput = document.querySelector('input[type="file"][accept*="image/jpeg,image/png,image/webp,video/mp4,video/webm"]') as HTMLInputElement
                        if (fileInput) fileInput.value = ''
                      }}
                    >
                      <IconX className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <Button 
                  type="button" 
                  onClick={addMedia} 
                  size="sm"
                  disabled={!selectedMediaFile}
                  className="w-fit"
                >
                  <IconPlus className="mr-2 h-4 w-4" />
                  Tambah Media
                </Button>
                
                {projectMedia.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Media yang Ditambahkan:</Label>
                    <div className="space-y-2">
                      {projectMedia.map((media) => (
                        <div key={media.id} className="flex items-center justify-between p-4 border rounded-lg bg-background">
                          <div className="flex items-center gap-3">
                            <Badge variant={media.mediaType === 'image' ? 'default' : 'secondary'}>
                              {media.mediaType}
                            </Badge>
                            {media.mediaType === 'image' && (
                              <img
                                src={media.mediaUrl}
                                alt="Media"
                                className="w-12 h-12 object-cover rounded-md border"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">
                                {media.mediaType === 'image' ? 'Gambar' : 'Video'}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {media.mediaUrl}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeMedia(media.id)}
                          >
                            <IconX className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Techstack Management */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground border-b pb-2">
                Techstack Project
              </h3>
              <div className="border rounded-lg p-6 space-y-6 bg-muted/30">
                <div className="flex gap-3">
                  <Select value={selectedTechstackId} onValueChange={setSelectedTechstackId}>
                    <SelectTrigger className="flex-1 h-10">
                      <SelectValue placeholder="Pilih techstack" />
                    </SelectTrigger>
                    <SelectContent>
                      {techstacks.map((techstack) => (
                        <SelectItem key={techstack.id} value={techstack.id}>
                          <div className="flex items-center gap-2">
                            {techstack.iconUrl && (
                              <img src={techstack.iconUrl} alt={techstack.name} className="w-4 h-4" />
                            )}
                            {techstack.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={addTechstack} size="sm" className="px-4">
                    <IconPlus className="mr-2 h-4 w-4" />
                    Tambah
                  </Button>
                </div>
                
                {projectTechstacks.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Techstack yang Dipilih:</Label>
                    <div className="flex flex-wrap gap-2">
                      {projectTechstacks.map((techstack, index) => (
                        <Badge key={`${techstack.techstack?.id || techstack.id}-${index}`} variant="outline" className="flex items-center gap-2 px-3 py-1">
                          {techstack.techstack?.iconUrl && (
                            <img src={techstack.techstack.iconUrl} alt={techstack.techstack.name || ''} className="w-4 h-4" />
                          )}
                          <span>{techstack.techstack?.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => removeTechstack(techstack.techstack?.id || "")}
                          >
                            <IconX className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 pt-6">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="min-w-[100px]">
              Batal
            </Button>
            <Button onClick={handleUpdate} disabled={isLoading} className="min-w-[100px]">
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3 pb-6 border-b">
            <DialogTitle className="text-xl font-semibold">Detail Project</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Informasi lengkap tentang project siswa
            </DialogDescription>
          </DialogHeader>
          
          {viewingProject && (
            <div className="space-y-6 py-6">
              {/* Project Header */}
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={viewingProject.thumbnailUrl || undefined} alt={viewingProject.title} />
                  <AvatarFallback className="text-lg">{viewingProject.title.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <h3 className="text-2xl font-bold">{viewingProject.title}</h3>
                  {viewingProject.description && (
                    <p className="text-muted-foreground">{viewingProject.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <IconCalendar className="h-4 w-4" />
                      <span>{new Date(viewingProject.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student & Category Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Siswa</Label>
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>{viewingProject.student?.fullName?.charAt(0) || 'S'}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{viewingProject.student?.fullName || 'Unknown'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Kategori</Label>
                  <div className="p-3 border rounded-lg">
                    {viewingProject.category ? (
                      <Badge variant="secondary">{viewingProject.category.name}</Badge>
                    ) : (
                      <span className="text-muted-foreground">Tidak ada kategori</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Links</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={viewingProject.githubUrl} target="_blank" rel="noopener noreferrer">
                      <IconBrandGithub className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                  {viewingProject.liveDemoUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={viewingProject.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                        <IconExternalLink className="h-4 w-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Techstacks */}
              {viewingProject.techstacks && viewingProject.techstacks.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tech Stack</Label>
                  <div className="flex flex-wrap gap-2">
                    {viewingProject.techstacks.map((techstack) => (
                      <Badge key={techstack.id} variant="outline">
                        {techstack.techstack?.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Media */}
              {viewingProject.media && viewingProject.media.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Media Project</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {viewingProject.media.map((media) => (
                      <div key={media.id} className="border rounded-lg overflow-hidden">
                        {media.mediaType === 'image' ? (
                          <img 
                            src={media.mediaUrl} 
                            alt="Project media" 
                            className="w-full h-32 object-cover"
                          />
                        ) : (
                          <video 
                            src={media.mediaUrl} 
                            className="w-full h-32 object-cover"
                            controls
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="pt-6">
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}