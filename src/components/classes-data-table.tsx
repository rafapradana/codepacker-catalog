"use client"

import * as React from "react"
import { IconPlus, IconEdit, IconTrash, IconSchool, IconSearch, IconChevronDown } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Class } from "@/lib/classes"

interface ClassesDataTableProps {
  data: Class[]
}

type SortOption = "name-asc" | "name-desc" | "created-asc" | "created-desc" | "updated-asc" | "updated-desc"

export function ClassesDataTable({ data }: ClassesDataTableProps) {
  const [classes, setClasses] = React.useState<Class[]>(data)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [editingClass, setEditingClass] = React.useState<Class | null>(null)
  const [className, setClassName] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortBy, setSortBy] = React.useState<SortOption>("updated-desc")

  const handleCreate = async () => {
    if (!className.trim()) {
      toast.error("Nama kelas tidak boleh kosong")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: className.trim() }),
      })

      if (response.ok) {
        const newClass = await response.json()
        setClasses([...classes, newClass])
        setClassName("")
        setIsCreateDialogOpen(false)
        toast.success("Kelas berhasil ditambahkan")
      } else {
        const error = await response.json()
        toast.error(error.message || "Gagal menambahkan kelas")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menambahkan kelas")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!className.trim() || !editingClass) {
      toast.error("Nama kelas tidak boleh kosong")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/classes/${editingClass.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: className.trim() }),
      })

      if (response.ok) {
        const updatedClass = await response.json()
        setClasses(classes.map(c => c.id === editingClass.id ? updatedClass : c))
        setClassName("")
        setEditingClass(null)
        setIsEditDialogOpen(false)
        toast.success("Kelas berhasil diperbarui")
      } else {
        const error = await response.json()
        toast.error(error.message || "Gagal memperbarui kelas")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memperbarui kelas")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (classToDelete: Class) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/classes/${classToDelete.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setClasses(classes.filter(c => c.id !== classToDelete.id))
        toast.success("Kelas berhasil dihapus")
      } else {
        const error = await response.json()
        toast.error(error.message || "Gagal menghapus kelas")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus kelas")
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (classItem: Class) => {
    setEditingClass(classItem)
    setClassName(classItem.name)
    setIsEditDialogOpen(true)
  }

  const resetCreateDialog = () => {
    setClassName("")
    setIsCreateDialogOpen(false)
  }

  const resetEditDialog = () => {
    setClassName("")
    setEditingClass(null)
    setIsEditDialogOpen(false)
  }

  // Filter classes based on search query
  const filteredClasses = classes.filter(classItem =>
    classItem.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort classes based on selected option
  const sortedClasses = [...filteredClasses].sort((a, b) => {
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
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      default:
        return 0
    }
  })

  const getSortLabel = (sortOption: SortOption) => {
    switch (sortOption) {
      case "name-asc":
        return "Nama A-Z"
      case "name-desc":
        return "Nama Z-A"
      case "created-asc":
        return "Terlama Dibuat"
      case "created-desc":
        return "Terbaru Dibuat"
      case "updated-asc":
        return "Terlama Diperbarui"
      case "updated-desc":
        return "Terbaru Diperbarui"
      default:
        return "Terbaru Diperbarui"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Daftar Kelas</h2>
          <p className="text-muted-foreground">
            Kelola data kelas siswa
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <IconPlus className="size-4 mr-2" />
              Tambah Kelas
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Tambah Kelas Baru</DialogTitle>
              <DialogDescription>
                Masukkan nama kelas yang ingin ditambahkan.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nama Kelas
                </Label>
                <Input
                  id="name"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="col-span-3"
                  placeholder="Contoh: XII RPL 1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetCreateDialog}>
                Batal
              </Button>
              <Button onClick={handleCreate} disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Search Bar and Sorting */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Cari kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <span>{getSortLabel(sortBy)}</span>
              <IconChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
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
      
      {sortedClasses.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <IconSchool className="size-12 mx-auto mb-4 opacity-50" />
          {searchQuery ? (
            <>
              <p>Tidak ada kelas yang ditemukan</p>
              <p className="text-sm">Coba ubah kata kunci pencarian Anda</p>
            </>
          ) : (
            <>
              <p>Belum ada data kelas</p>
              <p className="text-sm">Klik tombol "Tambah Kelas" untuk menambahkan kelas baru</p>
            </>
          )}
        </div>
      ) : (
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kelas</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead>Diperbarui</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedClasses.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell className="font-medium">
                    {classItem.name}
                  </TableCell>
                  <TableCell>
                    {new Date(classItem.createdAt).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell>
                    {new Date(classItem.updatedAt).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(classItem)}
                      >
                        <IconEdit className="size-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <IconTrash className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Kelas</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus kelas "{classItem.name}"? 
                              Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(classItem)}
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
              ))}
            </TableBody>
          </Table>
        )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Kelas</DialogTitle>
            <DialogDescription>
              Ubah nama kelas yang dipilih.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nama Kelas
              </Label>
              <Input
                id="edit-name"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="col-span-3"
                placeholder="Contoh: XII RPL 1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetEditDialog}>
              Batal
            </Button>
            <Button onClick={handleEdit} disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}