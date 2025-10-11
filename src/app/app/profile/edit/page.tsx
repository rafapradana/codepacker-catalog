'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, X, Plus } from "lucide-react"
import { getStudentSession } from "@/lib/session"

interface Student {
  id: string
  fullName: string
  bio: string | null
  profilePhotoUrl: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  user: {
    username: string
    email: string
  }
  class: {
    id: string
    name: string
  } | null
  studentSkills: Array<{
    skill: {
      id: string
      name: string
      iconUrl: string | null
      bgHex: string
      borderHex: string
      textHex: string
    }
  }>
}

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

export default function EditProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Form data
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    classId: '',
    githubUrl: '',
    linkedinUrl: '',
    email: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Username validation states
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle')
  const [usernameMessage, setUsernameMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = getStudentSession()
        if (!session) {
          setError('Not logged in')
          setLoading(false)
          return
        }

        // Fetch student profile
        const profileResponse = await fetch('/api/students/profile/current', {
          headers: {
            'Authorization': `Bearer ${session.id}`
          }
        })

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile')
        }

        const profileData = await profileResponse.json()
        setStudent(profileData)
        setFormData({
          fullName: profileData.fullName || '',
          bio: profileData.bio || '',
          githubUrl: profileData.githubUrl || '',
          linkedinUrl: profileData.linkedinUrl || '',
          classId: profileData.class?.id || '',
          email: profileData.user?.email || '',
          username: profileData.user?.username || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setSelectedSkills(profileData.studentSkills?.map((s: any) => s.skill.id) || [])
        setPreviewUrl(profileData.profilePhotoUrl)

        // Fetch classes
        const classesResponse = await fetch('/api/classes')
        if (classesResponse.ok) {
          const classesData = await classesResponse.json()
          setClasses(classesData)
        }

        // Fetch skills
        const skillsResponse = await fetch('/api/skills')
        if (skillsResponse.ok) {
          const skillsData = await skillsResponse.json()
          setSkills(skillsData)
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Username validation function
  const validateUsername = async (username: string) => {
    if (!username || username === student?.user.username) {
      setUsernameStatus('idle')
      setUsernameMessage('')
      return
    }

    // Basic validation
    if (username.length < 3) {
      setUsernameStatus('invalid')
      setUsernameMessage('Username harus minimal 3 karakter')
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameStatus('invalid')
      setUsernameMessage('Username hanya boleh mengandung huruf, angka, dan underscore')
      return
    }

    setUsernameStatus('checking')
    setUsernameMessage('Mengecek ketersediaan...')

    try {
      const response = await fetch(`/api/users/check-username?username=${encodeURIComponent(username)}`)
      const data = await response.json()

      if (data.available) {
        setUsernameStatus('available')
        setUsernameMessage('Username tersedia')
      } else {
        setUsernameStatus('taken')
        setUsernameMessage('Username sudah digunakan')
      }
    } catch (error) {
      setUsernameStatus('invalid')
      setUsernameMessage('Error mengecek username')
    }
  }

  // Debounced username validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateUsername(formData.username)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [formData.username, student?.user.username])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePhoto(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSkillToggle = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // Validate username if changed
      if (formData.username !== student?.user.username) {
        if (usernameStatus === 'taken' || usernameStatus === 'invalid') {
          throw new Error('Username tidak valid atau sudah digunakan')
        }
        if (usernameStatus === 'checking') {
          throw new Error('Masih mengecek ketersediaan username, silakan tunggu')
        }
      }

      // Validate password fields if changing password
      if (formData.newPassword || formData.currentPassword) {
        if (!formData.currentPassword) {
          throw new Error('Password saat ini diperlukan untuk mengubah password')
        }
        if (!formData.newPassword) {
          throw new Error('Password baru diperlukan')
        }
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('Password baru dan konfirmasi tidak cocok')
        }
        if (formData.newPassword.length < 6) {
          throw new Error('Password baru harus minimal 6 karakter')
        }
      }

      const session = getStudentSession()
      if (!session) {
        throw new Error('Not logged in')
      }

      // Upload profile photo if changed
      let profilePhotoUrl = student?.profilePhotoUrl
      if (profilePhoto) {
        const photoFormData = new FormData()
        photoFormData.append('file', profilePhoto)
        photoFormData.append('studentId', student!.id)

        const uploadResponse = await fetch('/api/upload/profile-photos', {
          method: 'POST',
          body: photoFormData
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          profilePhotoUrl = uploadData.url
        }
      }

      // Update profile
      const updateData = {
        ...formData,
        profilePhotoUrl,
        skillIds: selectedSkills
      }

      const response = await fetch('/api/students/profile/current', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.id}`
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      // Redirect back to profile
      router.push('/app/profile')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  if (error && !student) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Error</h1>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 lg:px-16 xl:px-24 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Profil</h1>
            <p className="text-muted-foreground">Perbarui informasi profil Anda</p>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo */}
          <Card>
            <CardHeader>
              <CardTitle>Foto Profil</CardTitle>
              <CardDescription>Unggah foto profil baru</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={previewUrl || ''} alt="Profile" />
                  <AvatarFallback className="text-lg">
                    {formData.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="photo" className="cursor-pointer">
                    <Button type="button" variant="outline" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Pilih Foto
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    JPG, PNG atau GIF. Maksimal 5MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
              <CardDescription>Informasi pribadi Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Masukkan nama lengkap Anda"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Masukkan username Anda"
                  required
                />
                {usernameMessage && (
                  <p className={`text-xs ${
                    usernameStatus === 'available' ? 'text-green-600' : 
                    usernameStatus === 'taken' || usernameStatus === 'invalid' ? 'text-red-600' : 
                    'text-yellow-600'
                  }`}>
                    {usernameMessage}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Ceritakan tentang diri Anda..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Kelas</Label>
                <Input
                  id="class"
                  value={student?.class?.name || 'Belum ada kelas'}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Kelas tidak dapat diubah. Hubungi administrator jika diperlukan.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Akun</CardTitle>
              <CardDescription>Perbarui email dan password Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email.anda@contoh.com"
                  required
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium">Ubah Password</h4>
                <p className="text-xs text-muted-foreground">
                  Biarkan field password kosong jika Anda tidak ingin mengubah password
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Password Saat Ini</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Masukkan password saat ini"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Masukkan password baru (min. 6 karakter)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Konfirmasi password baru"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Tautan Media Sosial</CardTitle>
              <CardDescription>Profil media sosial Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="github">URL GitHub</Label>
                <Input
                  id="github"
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                  placeholder="https://github.com/namapengguna"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">URL LinkedIn</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                  placeholder="https://linkedin.com/in/namapengguna"
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Keahlian</CardTitle>
              <CardDescription>Pilih keahlian teknis Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill.id}
                      checked={selectedSkills.includes(skill.id)}
                      onCheckedChange={() => handleSkillToggle(skill.id)}
                    />
                    <Label
                      htmlFor={skill.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      {skill.iconUrl && (
                        <img 
                          src={skill.iconUrl} 
                          alt={skill.name}
                          className="w-4 h-4"
                        />
                      )}
                      {skill.name}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Selected Skills Preview */}
              {selectedSkills.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Label className="text-sm font-medium mb-2 block">Keahlian Terpilih:</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skillId) => {
                      const skill = skills.find(s => s.id === skillId)
                      if (!skill) return null
                      return (
                        <Badge
                          key={skill.id}
                          variant="secondary"
                          className="px-3 py-1.5 text-xs font-medium flex items-center gap-1.5"
                          style={{
                            backgroundColor: skill.bgHex || undefined,
                            borderColor: skill.borderHex || undefined,
                            color: skill.textHex || undefined,
                          }}
                        >
                          {skill.iconUrl && (
                            <img 
                              src={skill.iconUrl} 
                              alt={skill.name}
                              className="w-3 h-3"
                            />
                          )}
                          {skill.name}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={saving}
            >
              Batal
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}