"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconPlus, IconEdit, IconTrash, IconUpload, IconX, IconSearch, IconChevronDown } from "@tabler/icons-react"
import { toast } from "sonner"
import { Skill } from "@/lib/skills"

type SortOption = "updated-desc" | "updated-asc" | "created-desc" | "created-asc" | "name-asc" | "name-desc"

interface SkillsDataTableProps {
  data: Skill[]
}

export function SkillsDataTable({ data: initialData }: SkillsDataTableProps) {
  const [data, setData] = useState<Skill[]>(initialData)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Search and sort state
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("updated-desc")
  
  const [formData, setFormData] = useState({
    name: "",
    bgHex: "#ffffff",
    borderHex: "#000000",
    textHex: "#000000",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetForm = () => {
    setFormData({
      name: "",
      bgHex: "#ffffff",
      borderHex: "#000000",
      textHex: "#000000",
    })
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Filter and sort skills
  const filteredSkills = data.filter(skill => {
    if (!searchQuery) return true
    
    const query = searchQuery.toLowerCase()
    return skill.name.toLowerCase().includes(query)
  })

  const sortedSkills = [...filteredSkills].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "created-asc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "created-desc":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "updated-asc":
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      case "updated-desc":
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    }
  })

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case "name-asc": return "Nama (A-Z)"
      case "name-desc": return "Nama (Z-A)"
      case "created-asc": return "Tanggal Dibuat (Lama)"
      case "created-desc": return "Tanggal Dibuat (Baru)"
      case "updated-asc": return "Tanggal Diperbarui (Lama)"
      case "updated-desc": return "Tanggal Diperbarui (Baru)"
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file")
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB")
        return
      }
      setSelectedFile(file)
    }
  }

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload/skill-icons', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload file')
      }

      const result = await response.json()
      return result.url
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error("Failed to upload file")
      return null
    }
  }

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error("Skill name is required")
      return
    }

    setIsLoading(true)
    try {
      let iconUrl = null
      
      // Upload file if selected
      if (selectedFile) {
        iconUrl = await uploadFile(selectedFile)
        if (!iconUrl) {
          setIsLoading(false)
          return
        }
      }

      const response = await fetch("/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          iconUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create skill")
      }

      const newSkill = await response.json()
      setData([...data, newSkill])
      setIsCreateDialogOpen(false)
      resetForm()
      toast.success("Skill created successfully")
    } catch (error) {
      console.error("Error creating skill:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create skill")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      bgHex: skill.bgHex,
      borderHex: skill.borderHex,
      textHex: skill.textHex,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingSkill || !formData.name.trim()) {
      toast.error("Skill name is required")
      return
    }

    setIsLoading(true)
    try {
      let iconUrl = editingSkill.iconUrl
      
      // Upload new file if selected
      if (selectedFile) {
        const uploadedUrl = await uploadFile(selectedFile)
        if (!uploadedUrl) {
          setIsLoading(false)
          return
        }
        iconUrl = uploadedUrl
      }

      const response = await fetch(`/api/skills/${editingSkill.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          iconUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update skill")
      }

      const updatedSkill = await response.json()
      setData(data.map(item => item.id === editingSkill.id ? updatedSkill : item))
      setIsEditDialogOpen(false)
      setEditingSkill(null)
      resetForm()
      toast.success("Skill updated successfully")
    } catch (error) {
      console.error("Error updating skill:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update skill")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete skill")
      }

      setData(data.filter(item => item.id !== id))
      toast.success("Skill deleted successfully")
    } catch (error) {
      console.error("Error deleting skill:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete skill")
    } finally {
      setIsLoading(false)
    }
  }

  const SkillPreview = ({ skill }: { skill: { name: string; iconUrl?: string | null; bgHex: string; borderHex: string; textHex: string } }) => (
    <div 
      className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium border"
      style={{
        backgroundColor: skill.bgHex,
        borderColor: skill.borderHex,
        color: skill.textHex,
      }}
    >
      {skill.iconUrl && (
        <img 
          src={skill.iconUrl} 
          alt={skill.name}
          className="w-4 h-4 object-contain"
        />
      )}
      {skill.name}
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kelola Skill</h1>
          <p className="text-muted-foreground">
            Kelola skill untuk profil siswa
          </p>
        </div>
        <div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <IconPlus className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Skill</DialogTitle>
                <DialogDescription>
                  Create a new skill with custom styling and optional icon.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter skill name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="icon">Icon (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                        ref={fileInputRef}
                        id="icon"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="flex-1"
                      />
                      {selectedFile && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedFile(null)
                            if (fileInputRef.current) {
                              fileInputRef.current.value = ""
                            }
                          }}
                        >
                          <IconX className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="bgHex">Background</Label>
                      <Input
                        id="bgHex"
                        type="color"
                        value={formData.bgHex}
                        onChange={(e) => setFormData({ ...formData, bgHex: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="borderHex">Border</Label>
                      <Input
                        id="borderHex"
                        type="color"
                        value={formData.borderHex}
                        onChange={(e) => setFormData({ ...formData, borderHex: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="textHex">Text</Label>
                      <Input
                        id="textHex"
                        type="color"
                        value={formData.textHex}
                        onChange={(e) => setFormData({ ...formData, textHex: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Preview</Label>
                    <SkillPreview skill={formData} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Skill"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
      </div>
      
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cari skill..."
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
              Tanggal Diperbarui (Baru)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("updated-asc")}>
              Tanggal Diperbarui (Lama)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("created-desc")}>
              Tanggal Dibuat (Baru)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("created-asc")}>
              Tanggal Dibuat (Lama)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("name-asc")}>
              Nama (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("name-desc")}>
              Nama (Z-A)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {sortedSkills.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchQuery ? "Tidak ada skill yang sesuai dengan pencarian." : "Belum ada skill. Tambahkan skill pertama Anda."}
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead>Colors</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSkills.map((skill) => (
              <TableRow key={skill.id}>
                <TableCell className="font-medium">{skill.name}</TableCell>
                <TableCell>
                  <SkillPreview skill={skill} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <div 
                      className="w-4 h-4 rounded border border-border"
                      style={{ backgroundColor: skill.bgHex }}
                      title={`Background: ${skill.bgHex}`}
                    />
                    <div 
                      className="w-4 h-4 rounded border border-border"
                      style={{ backgroundColor: skill.borderHex }}
                      title={`Border: ${skill.borderHex}`}
                    />
                    <div 
                      className="w-4 h-4 rounded border border-border"
                      style={{ backgroundColor: skill.textHex }}
                      title={`Text: ${skill.textHex}`}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(skill.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                              e.preventDefault()
                              console.log('Edit button clicked for skill:', skill.name)
                              handleEdit(skill)
                            }}
                    >
                      <IconEdit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            skill "{skill.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(skill.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
            <DialogDescription>
              Update the skill information and styling.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter skill name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-icon">Icon (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  ref={fileInputRef}
                  id="edit-icon"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="flex-1"
                />
                {selectedFile && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""
                      }
                    }}
                  >
                    <IconX className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name}
                </p>
              )}
              {editingSkill?.iconUrl && !selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Current icon: {editingSkill.iconUrl.split('/').pop()}
                </p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="edit-bgHex">Background</Label>
                <Input
                  id="edit-bgHex"
                  type="color"
                  value={formData.bgHex}
                  onChange={(e) => setFormData({ ...formData, bgHex: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-borderHex">Border</Label>
                <Input
                  id="edit-borderHex"
                  type="color"
                  value={formData.borderHex}
                  onChange={(e) => setFormData({ ...formData, borderHex: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-textHex">Text</Label>
                <Input
                  id="edit-textHex"
                  type="color"
                  value={formData.textHex}
                  onChange={(e) => setFormData({ ...formData, textHex: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Preview</Label>
              <SkillPreview skill={formData} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false)
              setEditingSkill(null)
              resetForm()
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Skill"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}