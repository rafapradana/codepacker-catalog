"use client"

import * as React from "react"
import { IconPlus, IconEdit, IconTrash, IconSchool } from "@tabler/icons-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Class } from "@/lib/classes"

interface ClassesDataTableProps {
  data: Class[]
}

export function ClassesDataTable({ data }: ClassesDataTableProps) {
  const [classes, setClasses] = React.useState<Class[]>(data)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [editingClass, setEditingClass] = React.useState<Class | null>(null)
  const [className, setClassName] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IconSchool className="size-5" />
              Daftar Kelas
            </CardTitle>
            <CardDescription>
              Kelola data kelas siswa
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <IconPlus className="size-4 mr-2" />
                Tambah Kelas
              </Button>
            </DialogTrigger>
            <DialogContent>
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
      </CardHeader>
      <CardContent>
        {classes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <IconSchool className="size-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada data kelas</p>
            <p className="text-sm">Klik tombol "Tambah Kelas" untuk menambahkan kelas baru</p>
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
              {classes.map((classItem) => (
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
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
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
    </Card>
  )
}