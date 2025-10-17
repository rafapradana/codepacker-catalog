"use client"

import React, { useState } from "react"
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
import { toast } from "sonner"
import { IconPlus, IconEdit, IconTrash, IconSearch, IconChevronDown } from "@tabler/icons-react"
import { Category } from "@/lib/categories"

type SortOption = "updated-desc" | "updated-asc" | "created-desc" | "created-asc" | "name-asc" | "name-desc"

interface CategoriesDataTableProps {
  data: Category[]
}

export function CategoriesDataTable({ data }: CategoriesDataTableProps) {
  const [categories, setCategories] = useState<Category[]>(data)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Search and sort state
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("updated-desc")
  
  const [formData, setFormData] = useState({
    name: "",
    bgHex: "#ffffff",
    borderHex: "#000000",
    textHex: "#000000"
  })

  const resetForm = () => {
    setFormData({
      name: "",
      bgHex: "#ffffff",
      borderHex: "#000000",
      textHex: "#000000"
    })
  }

  // Filter and sort categories
  const filteredCategories = categories.filter(category => {
    if (!searchQuery) return true
    
    const query = searchQuery.toLowerCase()
    return category.name.toLowerCase().includes(query)
  })

  const sortedCategories = React.useMemo(() => {
    return [...filteredCategories].sort((a, b) => {
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
  }, [filteredCategories, sortBy])

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

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error("Nama kategori tidak boleh kosong")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newCategory = await response.json()
        setCategories([...categories, newCategory])
        setIsCreateDialogOpen(false)
        resetForm()
        toast.success("Kategori berhasil dibuat")
      } else {
        const error = await response.json()
        toast.error(error.message || "Gagal membuat kategori")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat membuat kategori")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!editingCategory || !formData.name.trim()) {
      toast.error("Nama kategori tidak boleh kosong")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedCategory = await response.json()
        setCategories(categories.map(cat => 
          cat.id === editingCategory.id ? updatedCategory : cat
        ))
        setIsEditDialogOpen(false)
        setEditingCategory(null)
        resetForm()
        toast.success("Kategori berhasil diperbarui")
      } else {
        const error = await response.json()
        toast.error(error.message || "Gagal memperbarui kategori")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memperbarui kategori")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (category: Category) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCategories(categories.filter(cat => cat.id !== category.id))
        toast.success("Kategori berhasil dihapus")
      } else {
        const error = await response.json()
        toast.error(error.message || "Gagal menghapus kategori")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus kategori")
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      bgHex: category.bgHex,
      borderHex: category.borderHex,
      textHex: category.textHex
    })
    setIsEditDialogOpen(true)
  }

  const CategoryForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Nama
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="col-span-3"
          placeholder="Masukkan nama kategori"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="bgHex" className="text-right">
          Background
        </Label>
        <div className="col-span-3 flex items-center gap-2">
          <Input
            id="bgHex"
            type="color"
            value={formData.bgHex}
            onChange={(e) => setFormData({ ...formData, bgHex: e.target.value })}
            className="w-16 h-10"
          />
          <Input
            value={formData.bgHex}
            onChange={(e) => setFormData({ ...formData, bgHex: e.target.value })}
            className="flex-1"
            placeholder="#ffffff"
          />
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="borderHex" className="text-right">
          Border
        </Label>
        <div className="col-span-3 flex items-center gap-2">
          <Input
            id="borderHex"
            type="color"
            value={formData.borderHex}
            onChange={(e) => setFormData({ ...formData, borderHex: e.target.value })}
            className="w-16 h-10"
          />
          <Input
            value={formData.borderHex}
            onChange={(e) => setFormData({ ...formData, borderHex: e.target.value })}
            className="flex-1"
            placeholder="#000000"
          />
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="textHex" className="text-right">
          Text
        </Label>
        <div className="col-span-3 flex items-center gap-2">
          <Input
            id="textHex"
            type="color"
            value={formData.textHex}
            onChange={(e) => setFormData({ ...formData, textHex: e.target.value })}
            className="w-16 h-10"
          />
          <Input
            value={formData.textHex}
            onChange={(e) => setFormData({ ...formData, textHex: e.target.value })}
            className="flex-1"
            placeholder="#000000"
          />
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Preview</Label>
        <div className="col-span-3">
          <Badge 
            style={{
              backgroundColor: formData.bgHex,
              borderColor: formData.borderHex,
              color: formData.textHex,
              border: `1px solid ${formData.borderHex}`
            }}
          >
            {formData.name || "Preview"}
          </Badge>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kelola Kategori Project</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <IconPlus className="mr-2 h-4 w-4" />
              Tambah Kategori
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Kategori Baru</DialogTitle>
              <DialogDescription>
                Buat kategori project baru dengan warna yang sesuai.
              </DialogDescription>
            </DialogHeader>
            <CategoryForm />
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleCreate}
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[200px] justify-between">
              {getSortLabel(sortBy)}
              <IconChevronDown className="h-4 w-4" />
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead>Background</TableHead>
              <TableHead>Border</TableHead>
              <TableHead>Text</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "Tidak ada kategori yang sesuai dengan pencarian." : "Belum ada kategori. Tambahkan kategori pertama Anda."}
                </TableCell>
              </TableRow>
            ) : (
              sortedCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <Badge 
                      style={{
                        backgroundColor: category.bgHex,
                        borderColor: category.borderHex,
                        color: category.textHex,
                        border: `1px solid ${category.borderHex}`
                      }}
                    >
                      {category.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: category.bgHex }}
                      />
                      <span className="text-sm font-mono">{category.bgHex}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: category.borderHex }}
                      />
                      <span className="text-sm font-mono">{category.borderHex}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: category.textHex }}
                      />
                      <span className="text-sm font-mono">{category.textHex}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(category.createdAt).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log('Edit button clicked for category:', category.name)
                          openEditDialog(category)
                        }}
                        disabled={isLoading}
                      >
                        <IconEdit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isLoading}
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus kategori "{category.name}"? 
                              Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(category)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
            <DialogDescription>
              Perbarui informasi kategori project.
            </DialogDescription>
          </DialogHeader>
          <CategoryForm />
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleEdit}
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}