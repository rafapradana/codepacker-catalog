'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Github, ExternalLink, Upload, X, Plus, Loader2, Eye, Calendar } from 'lucide-react';
import { getStudentSession } from '@/lib/session';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

interface FormData {
  title: string;
  description: string;
  githubUrl: string;
  liveDemoUrl: string;
  categoryId: string;
  techstackIds: string[];
  thumbnailFile: File | null;
  mediaFiles: File[];
}

export default function CreateProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [techstacks, setTechstacks] = useState<any[]>([]);
  const [studentSession, setStudentSession] = useState<any>(null);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    githubUrl: '',
    liveDemoUrl: '',
    categoryId: '',
    techstackIds: [],
    thumbnailFile: null,
    mediaFiles: []
  });

  const [selectedTechstacks, setSelectedTechstacks] = useState<string[]>([]);

  // Check authentication and load data on component mount
  useEffect(() => {
    const session = getStudentSession();
    if (!session) {
      toast.error('Anda harus login terlebih dahulu');
      router.push('/login');
      return;
    }
    setStudentSession(session);
    
    // Load categories and techstacks from API
    loadCategories();
    loadTechstacks();
  }, [router]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        // Fallback to mock data if API fails
        setCategories([
          { id: '1', name: 'Web Development', bgHex: '#3b82f6', borderHex: '#2563eb', textHex: '#ffffff' },
          { id: '2', name: 'Mobile App', bgHex: '#10b981', borderHex: '#059669', textHex: '#ffffff' },
          { id: '3', name: 'Desktop App', bgHex: '#f59e0b', borderHex: '#d97706', textHex: '#ffffff' },
          { id: '4', name: 'Game Development', bgHex: '#ef4444', borderHex: '#dc2626', textHex: '#ffffff' },
          { id: '5', name: 'Machine Learning', bgHex: '#8b5cf6', borderHex: '#7c3aed', textHex: '#ffffff' }
        ]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      // Use mock data as fallback
      setCategories([
        { id: '1', name: 'Web Development', bgHex: '#3b82f6', borderHex: '#2563eb', textHex: '#ffffff' },
        { id: '2', name: 'Mobile App', bgHex: '#10b981', borderHex: '#059669', textHex: '#ffffff' },
        { id: '3', name: 'Desktop App', bgHex: '#f59e0b', borderHex: '#d97706', textHex: '#ffffff' },
        { id: '4', name: 'Game Development', bgHex: '#ef4444', borderHex: '#dc2626', textHex: '#ffffff' },
        { id: '5', name: 'Machine Learning', bgHex: '#8b5cf6', borderHex: '#7c3aed', textHex: '#ffffff' }
      ]);
    }
  };

  const loadTechstacks = async () => {
    try {
      const response = await fetch('/api/techstacks');
      if (response.ok) {
        const data = await response.json();
        setTechstacks(data);
      } else {
        // Fallback to mock data if API fails
        setTechstacks([
          { id: '1', name: 'React', bgHex: '#61dafb', borderHex: '#21d4fd', textHex: '#000000' },
          { id: '2', name: 'Next.js', bgHex: '#000000', borderHex: '#333333', textHex: '#ffffff' },
          { id: '3', name: 'TypeScript', bgHex: '#3178c6', borderHex: '#2d5aa0', textHex: '#ffffff' },
          { id: '4', name: 'Node.js', bgHex: '#339933', borderHex: '#2d7a2d', textHex: '#ffffff' },
          { id: '5', name: 'Python', bgHex: '#3776ab', borderHex: '#2d5aa0', textHex: '#ffffff' },
          { id: '6', name: 'PostgreSQL', bgHex: '#336791', borderHex: '#2d5aa0', textHex: '#ffffff' },
          { id: '7', name: 'Tailwind CSS', bgHex: '#06b6d4', borderHex: '#0891b2', textHex: '#ffffff' },
          { id: '8', name: 'Flutter', bgHex: '#02569b', borderHex: '#01447a', textHex: '#ffffff' }
        ]);
      }
    } catch (error) {
      console.error('Error loading techstacks:', error);
      // Use mock data as fallback
      setTechstacks([
        { id: '1', name: 'React', bgHex: '#61dafb', borderHex: '#21d4fd', textHex: '#000000' },
        { id: '2', name: 'Next.js', bgHex: '#000000', borderHex: '#333333', textHex: '#ffffff' },
        { id: '3', name: 'TypeScript', bgHex: '#3178c6', borderHex: '#2d5aa0', textHex: '#ffffff' },
        { id: '4', name: 'Node.js', bgHex: '#339933', borderHex: '#2d7a2d', textHex: '#ffffff' },
        { id: '5', name: 'Python', bgHex: '#3776ab', borderHex: '#2d5aa0', textHex: '#ffffff' },
        { id: '6', name: 'PostgreSQL', bgHex: '#336791', borderHex: '#2d5aa0', textHex: '#ffffff' },
        { id: '7', name: 'Tailwind CSS', bgHex: '#06b6d4', borderHex: '#0891b2', textHex: '#ffffff' },
        { id: '8', name: 'Flutter', bgHex: '#02569b', borderHex: '#01447a', textHex: '#ffffff' }
      ]);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTechstackToggle = (techstackId: string) => {
    setSelectedTechstacks(prev => {
      if (prev.includes(techstackId)) {
        return prev.filter(id => id !== techstackId);
      } else {
        return [...prev, techstackId];
      }
    });
  };

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        thumbnailFile: file
      }));
    }
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      mediaFiles: [...prev.mediaFiles, ...files]
    }));
  };

  const removeMediaFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, i) => i !== index)
    }));
  };

  // Upload thumbnail to Supabase
  const uploadThumbnail = async (file: File, userId: string): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      const response = await fetch('/api/upload/project-thumbnails', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload thumbnail');
      }
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      throw error;
    }
  };

  // Upload media files to Supabase
  const uploadMediaFiles = async (files: File[], userId: string): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);
        formData.append('mediaType', 'image');

        const response = await fetch('/api/upload/project-media', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          return data.url;
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to upload media');
        }
      } catch (error) {
        console.error('Error uploading media file:', error);
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  };

  // Form validation
  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error('Judul project harus diisi');
      return false;
    }

    if (!formData.githubUrl.trim()) {
      toast.error('GitHub repository URL harus diisi');
      return false;
    }

    // Validate GitHub URL format
    const githubUrlPattern = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/;
    if (!githubUrlPattern.test(formData.githubUrl)) {
      toast.error('Format URL GitHub tidak valid');
      return false;
    }

    // Validate live demo URL format if provided
    if (formData.liveDemoUrl && formData.liveDemoUrl.trim()) {
      try {
        new URL(formData.liveDemoUrl);
      } catch {
        toast.error('Format URL live demo tidak valid');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!studentSession) {
      toast.error('Sesi login tidak ditemukan. Silakan login kembali.');
      router.push('/login');
      return;
    }

    setIsLoading(true);

    try {
      let thumbnailUrl = null;
      let mediaUrls: string[] = [];

      // Upload thumbnail if provided
      if (formData.thumbnailFile) {
        toast.loading('Mengupload thumbnail...');
        thumbnailUrl = await uploadThumbnail(formData.thumbnailFile, studentSession.studentId);
      }

      // Upload media files if provided
      if (formData.mediaFiles.length > 0) {
        toast.loading('Mengupload media files...');
        mediaUrls = await uploadMediaFiles(formData.mediaFiles, studentSession.studentId);
      }

      // Create project
      toast.loading('Membuat project...');
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        githubUrl: formData.githubUrl.trim(),
        liveDemoUrl: formData.liveDemoUrl.trim() || null,
        categoryId: formData.categoryId || null,
        thumbnailUrl: thumbnailUrl,
        studentId: studentSession.studentId,
      };

      const projectResponse = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!projectResponse.ok) {
        const errorData = await projectResponse.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      const createdProject = await projectResponse.json();
      const projectId = createdProject.id;

      // Add tech stacks to project if selected
      if (selectedTechstacks.length > 0) {
        toast.loading('Menambahkan tech stacks...');
        const techstackPromises = selectedTechstacks.map(async (techstackId) => {
          const response = await fetch(`/api/projects/${projectId}/techstacks`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ techstackId }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to add techstack:', errorData);
          }
        });

        await Promise.all(techstackPromises);
      }

      // Add media files to project if uploaded
      if (mediaUrls.length > 0) {
        toast.loading('Menambahkan media files...');
        const mediaPromises = mediaUrls.map(async (mediaUrl) => {
          const response = await fetch(`/api/projects/${projectId}/media/direct`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              mediaUrl: mediaUrl,
              mediaType: 'image'
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to add media:', errorData);
          }
        });

        await Promise.all(mediaPromises);
      }

      toast.success('Project berhasil dibuat!');
      
      // Redirect to project detail or projects list
      router.push('/app/projects');
      
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast.error(error.message || 'Gagal membuat project. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            {/* Project Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Judul Project <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Masukkan judul project..."
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            {/* Project Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Deskripsi Project
              </Label>
              <Textarea
                id="description"
                placeholder="Ceritakan tentang project ini..."
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            {/* GitHub URL */}
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="text-sm font-medium">
                GitHub Repository <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="githubUrl"
                  placeholder="https://github.com/username/repository"
                  className="pl-10"
                  value={formData.githubUrl}
                  onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Live Demo URL */}
            <div className="space-y-2">
              <Label htmlFor="liveDemoUrl" className="text-sm font-medium">
                Live Demo URL
              </Label>
              <div className="relative">
                <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="liveDemoUrl"
                  placeholder="https://your-project-demo.com"
                  className="pl-10"
                  value={formData.liveDemoUrl}
                  onChange={(e) => handleInputChange('liveDemoUrl', e.target.value)}
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Kategori Project</Label>
              <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori project" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.bgHex }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tech Stack Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Tech Stack</Label>
              <div className="grid grid-cols-2 gap-2">
                {techstacks.map((tech) => (
                  <div
                    key={tech.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedTechstacks.includes(tech.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleTechstackToggle(tech.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tech.bgHex }}
                      />
                      <span className="text-sm font-medium">{tech.name}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Selected Tech Stacks */}
              {selectedTechstacks.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Tech Stack Terpilih:</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTechstacks.map((techId) => {
                      const tech = techstacks.find(t => t.id === techId);
                      return tech ? (
                        <Badge
                          key={techId}
                          variant="secondary"
                          className="flex items-center gap-1"
                          style={{
                            backgroundColor: tech.bgHex,
                            borderColor: tech.borderHex,
                            color: tech.textHex,
                          }}
                        >
                          {tech.name}
                          <X
                            className="w-3 h-3 cursor-pointer hover:opacity-70"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTechstackToggle(techId);
                            }}
                          />
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Thumbnail Project</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload thumbnail project (opsional)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('thumbnail-upload')?.click()}
                >
                  Pilih File
                </Button>
                {formData.thumbnailFile && (
                  <p className="text-xs text-muted-foreground mt-2">
                    File terpilih: {formData.thumbnailFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Media Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Media Project</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload gambar project (opsional)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMediaUpload}
                  className="hidden"
                  id="media-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('media-upload')?.click()}
                >
                  Pilih File
                </Button>
              </div>
              
              {/* Selected Media Files */}
              {formData.mediaFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">File Media Terpilih:</Label>
                  <div className="space-y-1">
                    {formData.mediaFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-xs truncate">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMediaFile(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Membuat Project...
                  </>
                ) : (
                  'Buat Project'
                )}
              </Button>
            </div>
          </form>
        </div>

      {/* Vertical Separator - Fixed in center */}
      <div className="flex items-center justify-center">
        <Separator orientation="vertical" className="h-screen" />
      </div>

      {/* Right Side - Preview */}
      <div className="flex-1 flex flex-col items-center justify-center h-screen overflow-hidden p-6">
        <div className="w-full max-w-sm h-full flex items-center justify-center">
          
          {/* Live Project Card Preview */}
          <div className="w-full max-h-full overflow-hidden">
            <div className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 border border-border/50 shadow-sm h-full flex flex-col py-0 rounded-lg bg-card">
              {/* Thumbnail Section */}
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted/30 to-muted/60">
                {formData.thumbnailFile ? (
                  <Image
                    src={URL.createObjectURL(formData.thumbnailFile)}
                    alt={formData.title || 'Project thumbnail'}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="text-center space-y-1.5">
                      <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary/60">
                          {formData.title ? formData.title.charAt(0).toUpperCase() : '?'}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">No Preview</span>
                    </div>
                  </div>
                )}
                
                {/* Category Badge */}
                {formData.categoryId && (
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 left-2 text-xs font-medium shadow-sm backdrop-blur-sm"
                    style={{
                      backgroundColor: categories.find(c => c.id === formData.categoryId)?.bgHex || undefined,
                      borderColor: categories.find(c => c.id === formData.categoryId)?.borderHex || undefined,
                      color: categories.find(c => c.id === formData.categoryId)?.textHex || undefined,
                    }}
                  >
                    {categories.find(c => c.id === formData.categoryId)?.name || 'Category'}
                  </Badge>
                )}
              </div>

              <div className="p-3 space-y-2.5 flex-1 flex flex-col">
                {/* Title & Description */}
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-foreground">
                    {formData.title || 'Judul Project Anda'}
                  </h3>
                  {formData.description && (
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {formData.description}
                    </p>
                  )}
                </div>

                {/* Student Info */}
                {studentSession && (
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/30 border border-border/30">
                    <Avatar className="h-7 w-7 border-2 border-background shadow-sm">
                      <AvatarImage src={studentSession.profilePhotoUrl || undefined} />
                      <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                        {studentSession.name ? studentSession.name.charAt(0) : 'S'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate text-foreground">
                        {studentSession.name || 'Student Name'}
                      </p>
                      {studentSession.className && (
                        <p className="text-xs text-muted-foreground truncate font-medium">
                          {studentSession.className}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Date & Actions */}
                <div className="space-y-2.5 mt-auto pt-2.5 border-t border-border/30">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium">
                      {new Date().toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Action Button - Full width "Lihat Detail" */}
                  <Button variant="default" size="sm" className="w-full h-8 text-xs font-medium">
                    <Eye className="h-3 w-3 mr-1" />
                    Lihat Detail
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}