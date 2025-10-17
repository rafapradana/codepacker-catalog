"use client"

import React, { useState, useRef } from "react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { IconPlus, IconEdit, IconTrash, IconUpload, IconX, IconSearch, IconChevronDown } from "@tabler/icons-react"
import { toast } from "sonner"
import { TechStack } from "@/lib/techstacks"

type SortOption = "updated-desc" | "updated-asc" | "created-desc" | "created-asc" | "name-asc" | "name-desc"

interface TechStacksDataTableProps {
  data: TechStack[]
}

export function TechStacksDataTable({ data: initialData }: TechStacksDataTableProps) {
  const [data, setData] = useState<TechStack[]>(initialData)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTechStack, setEditingTechStack] = useState<TechStack | null>(null)
  const [isLoading, setIsLoading] = useState(false)
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

  // Filter and sort techstacks
  const filteredTechstacks = React.useMemo(() => {
    return data.filter(techstack =>
      techstack.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [data, searchQuery])

  const sortedTechstacks = React.useMemo(() => {
    const sorted = [...filteredTechstacks]
    
    switch (sortBy) {
      case "name-asc":
        return sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
      case "name-desc":
        return sorted.sort((a, b) => (b.name || "").localeCompare(a.name || ""))
      case "created-asc":
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      case "created-desc":
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case "updated-asc":
        return sorted.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
      case "updated-desc":
        return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      default:
        return sorted
    }
  }, [filteredTechstacks, sortBy])

  const getSortLabel = (sortOption: SortOption): string => {
    switch (sortOption) {
      case "updated-desc": return "Tanggal Diperbarui (Baru)"
      case "updated-asc": return "Tanggal Diperbarui (Lama)"
      case "created-desc": return "Tanggal Dibuat (Baru)"
      case "created-asc": return "Tanggal Dibuat (Lama)"
      case "name-asc": return "Nama (A-Z)"
      case "name-desc": return "Nama (Z-A)"
      default: return "Tanggal Diperbarui (Baru)"
    }
  }

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload/techstack-icons', {
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
      toast.error("Tech stack name is required")
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

      const response = await fetch("/api/techstacks", {
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
        throw new Error(errorData.error || "Failed to create tech stack")
      }

      const newTechStack = await response.json()
      setData([...data, newTechStack])
      setIsCreateDialogOpen(false)
      resetForm()
      toast.success("Tech stack created successfully")
    } catch (error) {
      console.error("Error creating tech stack:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create tech stack")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (techstack: TechStack) => {
    setEditingTechStack(techstack)
    setFormData({
      name: techstack.name,
      bgHex: techstack.bgHex,
      borderHex: techstack.borderHex,
      textHex: techstack.textHex,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingTechStack || !formData.name.trim()) {
      toast.error("Tech stack name is required")
      return
    }

    setIsLoading(true)
    try {
      let iconUrl = editingTechStack.iconUrl
      
      // Upload new file if selected
      if (selectedFile) {
        const uploadedUrl = await uploadFile(selectedFile)
        if (!uploadedUrl) {
          setIsLoading(false)
          return
        }
        iconUrl = uploadedUrl
      }

      const response = await fetch(`/api/techstacks/${editingTechStack.id}`, {
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
        throw new Error(errorData.error || "Failed to update tech stack")
      }

      const updatedTechStack = await response.json()
      setData(data.map(item => item.id === editingTechStack.id ? updatedTechStack : item))
      setIsEditDialogOpen(false)
      setEditingTechStack(null)
      resetForm()
      toast.success("Tech stack updated successfully")
    } catch (error) {
      console.error("Error updating tech stack:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update tech stack")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/techstacks/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete tech stack")
      }

      setData(data.filter(item => item.id !== id))
      toast.success("Tech stack deleted successfully")
    } catch (error) {
      console.error("Error deleting tech stack:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete tech stack")
    } finally {
      setIsLoading(false)
    }
  }

  const TechStackPreview = ({ techstack }: { techstack: { name: string; iconUrl?: string | null; bgHex: string; borderHex: string; textHex: string } }) => (
    <div 
      className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium border"
      style={{
        backgroundColor: techstack.bgHex,
        borderColor: techstack.borderHex,
        color: techstack.textHex,
      }}
    >
      {techstack.iconUrl && (
        <img 
          src={techstack.iconUrl} 
          alt={techstack.name}
          className="w-4 h-4 object-contain"
        />
      )}
      {techstack.name}
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kelola Tech Stack</h2>
          <p className="text-muted-foreground">
            Kelola tech stack untuk project siswa
          </p>
        </div>
        <div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <IconPlus className="mr-2 h-4 w-4" />
                Add Tech Stack
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Tech Stack</DialogTitle>
                <DialogDescription>
                  Create a new tech stack with custom styling and optional icon.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter tech stack name"
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
                  <TechStackPreview techstack={formData} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Tech Stack"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cari tech stack..."
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
      
      {sortedTechstacks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchQuery ? "Tidak ada tech stack yang sesuai dengan pencarian." : "Belum ada tech stack. Tambahkan tech stack pertama Anda."}
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
              {sortedTechstacks.map((techstack) => (
                <TableRow key={techstack.id}>
                  <TableCell className="font-medium">{techstack.name}</TableCell>
                  <TableCell>
                    <TechStackPreview techstack={techstack} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <div 
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: techstack.bgHex }}
                        title={`Background: ${techstack.bgHex}`}
                      />
                      <div 
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: techstack.borderHex }}
                        title={`Border: ${techstack.borderHex}`}
                      />
                      <div 
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: techstack.textHex }}
                        title={`Text: ${techstack.textHex}`}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(techstack.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                              e.preventDefault()
                              console.log('Edit button clicked for techstack:', techstack.name)
                              handleEdit(techstack)
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
                              tech stack "{techstack.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(techstack.id)}
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
              <DialogTitle>Edit Tech Stack</DialogTitle>
              <DialogDescription>
                Update the tech stack information and styling.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter tech stack name"
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
                {editingTechStack?.iconUrl && !selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Current icon: {editingTechStack.iconUrl.split('/').pop()}
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
                <TechStackPreview techstack={formData} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false)
                setEditingTechStack(null)
                resetForm()
              }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Tech Stack"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }