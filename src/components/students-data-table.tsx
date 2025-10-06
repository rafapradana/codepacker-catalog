"use client"

import * as React from "react"
import { IconPlus, IconEdit, IconTrash, IconUser, IconUpload, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Student } from "@/lib/students"
import { Class } from "@/lib/classes"
import { Skill } from "@/lib/skills"

interface StudentsDataTableProps {
  data: Student[]
  classes: Class[]
  skills: Skill[]
}

interface StudentFormData {
  // User fields
  username: string
  email: string
  password: string
  // Student fields
  fullName: string
  bio: string
  profilePhotoUrl: string | null
  githubUrl: string
  linkedinUrl: string
  classId: string | null
}

interface StudentSkill {
  id: string
  name: string
  iconUrl: string | null
  bgHex: string
  borderHex: string
  textHex: string
}

export function StudentsDataTable({ data, classes, skills }: StudentsDataTableProps) {
  const [students, setStudents] = React.useState<Student[]>(data)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [editingStudent, setEditingStudent] = React.useState<Student | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  
  // Form state
  const [formData, setFormData] = React.useState<StudentFormData>({
    username: "",
    email: "",
    password: "",
    fullName: "",
    bio: "",
    profilePhotoUrl: null,
    githubUrl: "",
    linkedinUrl: "",
    classId: null,
  })
  
  // File upload state
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [filePreview, setFilePreview] = React.useState<string | null>(null)
  
  // Skills management state
  const [studentSkills, setStudentSkills] = React.useState<StudentSkill[]>([])
  const [selectedSkillId, setSelectedSkillId] = React.useState<string | undefined>(undefined)

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      fullName: "",
      bio: "",
      profilePhotoUrl: null,
      githubUrl: "",
      linkedinUrl: "",
      classId: null,
    })
    setSelectedFile(null)
    setFilePreview(null)
    setStudentSkills([])
    setSelectedSkillId(undefined)
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

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch('/api/upload/profile-photos', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const result = await response.json()
        return result.url
      } else {
        const error = await response.json()
        toast.error(error.error || "Gagal mengupload foto")
        return null
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengupload foto")
      return null
    }
  }

  const fetchStudentSkills = async (studentId: string) => {
    try {
      const response = await fetch(`/api/students/${studentId}/skills`)
      if (response.ok) {
        const skills = await response.json()
        setStudentSkills(skills)
      }
    } catch (error) {
      console.error("Error fetching student skills:", error)
    }
  }

  const handleAddSkill = async () => {
    if (!selectedSkillId) {
      toast.error("Pilih skill terlebih dahulu")
      return
    }

    const studentId = editingStudent?.id
    if (!studentId) return

    try {
      const response = await fetch(`/api/students/${studentId}/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skillId: selectedSkillId }),
      })

      if (response.ok) {
        await fetchStudentSkills(studentId)
        setSelectedSkillId(undefined)
        toast.success("Skill berhasil ditambahkan")
      } else {
        const error = await response.json()
        toast.error(error.error || "Gagal menambahkan skill")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menambahkan skill")
    }
  }

  const handleRemoveSkill = async (skillId: string) => {
    const studentId = editingStudent?.id
    if (!studentId) return

    try {
      const response = await fetch(`/api/students/${studentId}/skills`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skillId }),
      })

      if (response.ok) {
        await fetchStudentSkills(studentId)
        toast.success("Skill berhasil dihapus")
      } else {
        const error = await response.json()
        toast.error(error.error || "Gagal menghapus skill")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus skill")
    }
  }

  const handleCreate = async () => {
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim() || !formData.fullName.trim()) {
      toast.error("Username, email, password, dan nama lengkap wajib diisi")
      return
    }

    setIsLoading(true)
    try {
      let profilePhotoUrl = formData.profilePhotoUrl

      // Upload file if selected
      if (selectedFile) {
        profilePhotoUrl = await uploadFile(selectedFile)
        if (!profilePhotoUrl) {
          setIsLoading(false)
          return
        }
      }

      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          profilePhotoUrl,
          bio: formData.bio || null,
          githubUrl: formData.githubUrl || null,
          linkedinUrl: formData.linkedinUrl || null,
        }),
      })

      if (response.ok) {
        const newStudent = await response.json()
        setStudents([...students, newStudent])
        resetForm()
        setIsCreateDialogOpen(false)
        toast.success("Siswa berhasil ditambahkan")
      } else {
        const error = await response.json()
        toast.error(error.error || "Gagal menambahkan siswa")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menambahkan siswa")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setFormData({
      username: student.user?.username || "",
      email: student.user?.email || "",
      password: "", // Don't pre-fill password for security
      fullName: student.fullName,
      bio: student.bio || "",
      profilePhotoUrl: student.profilePhotoUrl || null,
      githubUrl: student.githubUrl || "",
      linkedinUrl: student.linkedinUrl || "",
      classId: student.classId || null,
    })
    setFilePreview(student.profilePhotoUrl || null)
    fetchStudentSkills(student.id)
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!formData.fullName.trim() || !formData.username.trim() || !formData.email.trim() || !editingStudent) {
      toast.error("Username, email, dan nama lengkap wajib diisi")
      return
    }

    setIsLoading(true)
    try {
      let profilePhotoUrl = formData.profilePhotoUrl

      // Upload new file if selected
      if (selectedFile) {
        profilePhotoUrl = await uploadFile(selectedFile)
        if (!profilePhotoUrl) {
          setIsLoading(false)
          return
        }
      }

      const updateData: any = {
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        bio: formData.bio || null,
        profilePhotoUrl,
        githubUrl: formData.githubUrl || null,
        linkedinUrl: formData.linkedinUrl || null,
        classId: formData.classId,
      }

      // Only include password if it's provided
      if (formData.password.trim()) {
        updateData.password = formData.password
      }

      const response = await fetch(`/api/students/${editingStudent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        const updatedStudent = await response.json()
        setStudents(students.map(s => s.id === editingStudent.id ? updatedStudent : s))
        resetForm()
        setEditingStudent(null)
        setIsEditDialogOpen(false)
        toast.success("Siswa berhasil diperbarui")
      } else {
        const error = await response.json()
        toast.error(error.error || "Gagal memperbarui siswa")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memperbarui siswa")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (student: Student) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/students/${student.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setStudents(students.filter(s => s.id !== student.id))
        toast.success("Siswa berhasil dihapus")
      } else {
        const error = await response.json()
        toast.error(error.error || "Gagal menghapus siswa")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus siswa")
    } finally {
      setIsLoading(false)
    }
  }

  const StudentPreview = ({ student }: { student: Partial<Student & { class?: { id: string; name: string } }> }) => (
    <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
      <Avatar className="h-12 w-12">
        <AvatarImage src={filePreview || student.profilePhotoUrl || ""} />
        <AvatarFallback>
          <IconUser className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{formData.fullName || "Nama Siswa"}</p>
        <p className="text-sm text-muted-foreground truncate">
          {student.class?.name || "Belum ada kelas"}
        </p>
      </div>
    </div>
  )

  const availableSkills = skills.filter(skill => 
    !studentSkills.some(studentSkill => studentSkill.id === skill.id)
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IconUser className="h-5 w-5" />
              Kelola Siswa
            </CardTitle>
            <CardDescription>
              Kelola data siswa, foto profil, dan skill yang dimiliki
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <IconPlus className="h-4 w-4 mr-2" />
                Tambah Siswa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tambah Siswa Baru</DialogTitle>
                <DialogDescription>
                  Isi form di bawah untuk menambahkan siswa baru
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username *
                  </Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="col-span-3"
                    placeholder="Username untuk login"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="col-span-3"
                    placeholder="Email siswa"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="col-span-3"
                    placeholder="Password untuk login"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fullName" className="text-right">
                    Nama Lengkap *
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bio" className="text-right">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="profilePhoto" className="text-right">
                    Foto Profil
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <Input
                      id="profilePhoto"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Format: JPG, PNG, GIF. Maksimal 5MB
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="githubUrl" className="text-right">
                    GitHub URL
                  </Label>
                  <Input
                    id="githubUrl"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="col-span-3"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="linkedinUrl" className="text-right">
                    LinkedIn URL
                  </Label>
                  <Input
                    id="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="col-span-3"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="classId" className="text-right">
                    Kelas
                  </Label>
                  <Select
                    value={formData.classId || "no-class"}
                    onValueChange={(value) => setFormData({ ...formData, classId: value === "no-class" ? null : value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-class">Tidak ada kelas</SelectItem>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Preview</Label>
                  <div className="col-span-3">
                    <StudentPreview student={{ class: classes.find(c => c.id === formData.classId) }} />
                  </div>
                </div>
              </div>

              {/* Skills Management */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Kelola Skills</h3>
                
                {/* Add Skill */}
                <div className="flex gap-2">
                  <Select value={selectedSkillId} onValueChange={setSelectedSkillId}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Pilih skill untuk ditambahkan" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSkills.map((skill) => (
                        <SelectItem key={skill.id} value={skill.id}>
                          {skill.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddSkill} disabled={!selectedSkillId}>
                    <IconPlus className="h-4 w-4 mr-2" />
                    Tambah
                  </Button>
                </div>

                {/* Current Skills */}
                <div className="space-y-2">
                  <Label>Skills Saat Ini</Label>
                  {studentSkills.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Belum ada skill</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {studentSkills.map((skill) => (
                        <Badge
                          key={skill.id}
                          variant="secondary"
                          className="flex items-center gap-2"
                          style={{
                            backgroundColor: skill.bgHex,
                            borderColor: skill.borderHex,
                            color: skill.textHex,
                          }}
                        >
                          {skill.iconUrl && (
                            <img src={skill.iconUrl} alt="" className="w-4 h-4" />
                          )}
                          {skill.name}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => handleRemoveSkill(skill.id)}
                          >
                            <IconX className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setIsCreateDialogOpen(false)
                  }}
                >
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
        {students.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada data siswa. Klik "Tambah Siswa" untuk menambahkan siswa baru.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Siswa</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.profilePhotoUrl || ""} />
                        <AvatarFallback>
                          <IconUser className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          @{student.user?.username}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.user?.email}</TableCell>
                  <TableCell>
                    {student.class?.name ? (
                      <Badge variant="secondary">{student.class.name}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(student.createdAt).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(student)}
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
                            <AlertDialogTitle>Hapus Siswa</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus siswa "{student.fullName}"? 
                              Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(student)}
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
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Siswa</DialogTitle>
            <DialogDescription>
              Perbarui informasi siswa dan kelola skill yang dimiliki
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Student Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informasi Siswa</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-username" className="text-right">
                    Username *
                  </Label>
                  <Input
                    id="edit-username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email *
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-password" className="text-right">
                    Password Baru
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <Input
                      id="edit-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Kosongkan jika tidak ingin mengubah password"
                    />
                    <p className="text-xs text-muted-foreground">
                      Kosongkan jika tidak ingin mengubah password
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-fullName" className="text-right">
                    Nama Lengkap *
                  </Label>
                  <Input
                    id="edit-fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-bio" className="text-right">
                    Bio
                  </Label>
                  <Textarea
                    id="edit-bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-profilePhoto" className="text-right">
                    Foto Profil
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <Input
                      id="edit-profilePhoto"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Kosongkan jika tidak ingin mengubah foto
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-githubUrl" className="text-right">
                    GitHub URL
                  </Label>
                  <Input
                    id="edit-githubUrl"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-linkedinUrl" className="text-right">
                    LinkedIn URL
                  </Label>
                  <Input
                    id="edit-linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-classId" className="text-right">
                    Kelas
                  </Label>
                  <Select
                    value={formData.classId || "no-class"}
                    onValueChange={(value) => setFormData({ ...formData, classId: value === "no-class" ? null : value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-class">Tidak ada kelas</SelectItem>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Preview</Label>
                  <div className="col-span-3">
                    <StudentPreview student={{ class: classes.find(c => c.id === formData.classId) }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Management */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Kelola Skills</h3>
              
              {/* Add Skill */}
              <div className="flex gap-2">
                <Select value={selectedSkillId} onValueChange={setSelectedSkillId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Pilih skill untuk ditambahkan" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSkills.map((skill) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddSkill} disabled={!selectedSkillId}>
                  <IconPlus className="h-4 w-4 mr-2" />
                  Tambah
                </Button>
              </div>

              {/* Current Skills */}
              <div className="space-y-2">
                <Label>Skills Saat Ini</Label>
                {studentSkills.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Belum ada skill</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {studentSkills.map((skill) => (
                      <Badge
                        key={skill.id}
                        variant="secondary"
                        className="flex items-center gap-2"
                        style={{
                          backgroundColor: skill.bgHex,
                          borderColor: skill.borderHex,
                          color: skill.textHex,
                        }}
                      >
                        {skill.iconUrl && (
                          <img src={skill.iconUrl} alt="" className="w-4 h-4" />
                        )}
                        {skill.name}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => handleRemoveSkill(skill.id)}
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
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                setEditingStudent(null)
                setIsEditDialogOpen(false)
              }}
            >
              Batal
            </Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}