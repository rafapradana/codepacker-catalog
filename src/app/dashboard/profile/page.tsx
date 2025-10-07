"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { StudentSidebar } from "@/components/student-sidebar"
import { StudentSiteHeader } from "@/components/student-site-header"
import { Loader2, Upload, X, Plus, Github, Linkedin, User, Mail, BookOpen, Award } from "lucide-react"
import { toast } from "sonner"

interface Class {
  id: string
  name: string
}

interface Skill {
  id: string
  name: string
  iconUrl: string | null
  bgHex: string
  borderHex: string
  textHex: string
}

interface StudentProfile {
  id: string
  userId: string
  fullName: string
  bio?: string | null
  profilePhotoUrl?: string | null
  githubUrl?: string | null
  linkedinUrl?: string | null
  classId?: string | null
  user?: {
    id: string
    username: string
    email: string
    role: string
  } | null
  class?: {
    id: string
    name: string
  } | null
  skills: Skill[]
}

interface LoggedInUser {
  id: string
  username: string
  email: string
  role: string
  name: string
  bio: string | null
  profilePhotoUrl: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  classId: string | null
}

export default function StudentProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [allSkills, setAllSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    githubUrl: "",
    linkedinUrl: "",
    classId: "",
  })

  // Fetch profile data
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("student")
    if (!userData) {
      router.push("/login")
      return
    }

    try {
      const user = JSON.parse(userData) as LoggedInUser
      setLoggedInUser(user)
      fetchProfile(user.id)
      fetchClasses()
      fetchAllSkills()
    } catch (error) {
      console.error("Error parsing user data:", error)
      router.push("/login")
    }
  }, [router])

  const fetchProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/student/profile?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data.student)
        setFormData({
          fullName: data.student.fullName || "",
          bio: data.student.bio || "",
          githubUrl: data.student.githubUrl || "",
          linkedinUrl: data.student.linkedinUrl || "",
          classId: data.student.classId || "",
        })
      } else {
        toast.error("Gagal memuat profil")
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Terjadi kesalahan saat memuat profil")
    } finally {
      setLoading(false)
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/classes")
      if (response.ok) {
        const data = await response.json()
        setClasses(data)
      }
    } catch (error) {
      console.error("Error fetching classes:", error)
    }
  }

  const fetchAllSkills = async () => {
    try {
      const response = await fetch("/api/skills")
      if (response.ok) {
        const data = await response.json()
        setAllSkills(data)
      }
    } catch (error) {
      console.error("Error fetching skills:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleProfilePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB")
      return
    }

    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "profile")

      const response = await fetch("/api/upload/profile-photos", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update profile with new photo URL
        const updateResponse = await fetch(`/api/student/profile?userId=${loggedInUser?.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profilePhotoUrl: data.url,
          }),
        })

        if (updateResponse.ok) {
          setProfile(prev => prev ? { ...prev, profilePhotoUrl: data.url } : null)
          toast.success("Foto profil berhasil diperbarui")
        } else {
          toast.error("Gagal memperbarui foto profil")
        }
      } else {
        toast.error("Gagal mengunggah foto")
      }
    } catch (error) {
      console.error("Error uploading photo:", error)
      toast.error("Terjadi kesalahan saat mengunggah foto")
    } finally {
      setUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    
    try {
      const response = await fetch(`/api/student/profile?userId=${loggedInUser?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.student)
        toast.success("Profil berhasil diperbarui")
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Gagal memperbarui profil")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      toast.error("Terjadi kesalahan saat menyimpan profil")
    } finally {
      setSaving(false)
    }
  }

  const handleAddSkill = async (skillId: string) => {
    try {
      const response = await fetch("/api/student/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skillId, userId: loggedInUser?.id }),
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(prev => prev ? { ...prev, skills: data.skills } : null)
        toast.success("Skill berhasil ditambahkan")
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Gagal menambahkan skill")
      }
    } catch (error) {
      console.error("Error adding skill:", error)
      toast.error("Terjadi kesalahan saat menambahkan skill")
    }
  }

  const handleRemoveSkill = async (skillId: string) => {
    try {
      const response = await fetch("/api/student/skills", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skillId, userId: loggedInUser?.id }),
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(prev => prev ? { ...prev, skills: data.skills } : null)
        toast.success("Skill berhasil dihapus")
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Gagal menghapus skill")
      }
    } catch (error) {
      console.error("Error removing skill:", error)
      toast.error("Terjadi kesalahan saat menghapus skill")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Profil tidak ditemukan</h2>
          <p className="text-muted-foreground mb-4">Silakan login kembali</p>
          <Button onClick={() => router.push("/login")}>
            Kembali ke Login
          </Button>
        </div>
      </div>
    )
  }

  const availableSkills = allSkills.filter(
    skill => !profile?.skills?.some(userSkill => userSkill.id === skill.id)
  )

  return (
    <SidebarProvider>
      <StudentSidebar />
      <SidebarInset>
        <StudentSiteHeader title="Kelola Profil" />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <div className="container mx-auto py-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Kelola Profil</h1>
                  <p className="text-muted-foreground">
                    Kelola informasi profil dan skill Anda
                  </p>
                </div>
              </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Photo & Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informasi Dasar
            </CardTitle>
            <CardDescription>
              Perbarui foto profil dan informasi dasar Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Photo */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.profilePhotoUrl || ""} />
                <AvatarFallback className="text-lg">
                  {profile.fullName.split(" ").map(n => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm" disabled={uploading} asChild>
                    <span>
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      {uploading ? "Mengunggah..." : "Ubah Foto"}
                    </span>
                  </Button>
                </Label>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePhotoUpload}
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile.user?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email tidak dapat diubah
                </p>
              </div>

              <div>
                <Label htmlFor="class">Kelas</Label>
                <Select
                  value={formData.classId}
                  onValueChange={(value) => handleInputChange("classId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Ceritakan tentang diri Anda..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links & Skills */}
        <div className="space-y-6">
          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Tautan Sosial
              </CardTitle>
              <CardDescription>
                Tambahkan tautan GitHub dan LinkedIn Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="githubUrl" className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  GitHub URL
                </Label>
                <Input
                  id="githubUrl"
                  value={formData.githubUrl}
                  onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <Label htmlFor="linkedinUrl" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn URL
                </Label>
                <Input
                  id="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Skills
              </CardTitle>
              <CardDescription>
                Kelola skill dan keahlian Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Skills */}
              <div>
                <Label className="text-sm font-medium">Skill Saat Ini</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile?.skills?.length > 0 ? (
                    profile.skills.map((skill) => (
                      <Badge
                        key={skill.id}
                        variant="secondary"
                        className="flex items-center gap-1"
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
                            className="h-3 w-3"
                          />
                        )}
                        {skill.name}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                          onClick={() => handleRemoveSkill(skill.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Belum ada skill yang ditambahkan
                    </p>
                  )}
                </div>
              </div>

              {/* Add Skills */}
              {availableSkills.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Tambah Skill</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableSkills.map((skill) => (
                      <Badge
                        key={skill.id}
                        variant="outline"
                        className="flex items-center gap-1 cursor-pointer hover:bg-muted"
                        onClick={() => handleAddSkill(skill.id)}
                        style={{
                          borderColor: skill.borderHex,
                        }}
                      >
                        {skill.iconUrl && (
                          <img
                            src={skill.iconUrl}
                            alt={skill.name}
                            className="h-3 w-3"
                          />
                        )}
                        {skill.name}
                        <Plus className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveProfile} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Menyimpan...
            </>
          ) : (
            "Simpan Perubahan"
          )}
        </Button>
      </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}