'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Github, ExternalLink, Upload, X, Plus, Loader2, Eye, Calendar, ArrowLeft } from 'lucide-react';
import { getStudentSession } from '@/lib/session';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
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

interface Project {
  id: string;
  title: string;
  description: string | null;
  githubUrl: string | null;
  liveDemoUrl: string | null;
  thumbnailUrl: string | null;
  categoryId: string | null;
  studentId: string;
  projectTechstacks: Array<{
    techstackId: string;
  }>;
  projectMedia: Array<{
    mediaUrl: string;
  }>;
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [studentSession, setStudentSession] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [techstacks, setTechstacks] = useState<any[]>([]);
  const [selectedTechstacks, setSelectedTechstacks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'thumbnail' | 'media'>('thumbnail');
  const [deleteMediaIndex, setDeleteMediaIndex] = useState<number>(-1);
  const [thumbnailDeleted, setThumbnailDeleted] = useState(false);
  const [mediaDeleted, setMediaDeleted] = useState<number[]>([]);

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

  // Load initial data
  useEffect(() => {
    const session = getStudentSession();
    if (!session) {
      router.push('/login');
      return;
    }
    setStudentSession(session);

    const loadData = async () => {
      try {
        const [categoriesRes, techstacksRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/techstacks')
        ]);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }

        if (techstacksRes.ok) {
          const techstacksData = await techstacksRes.json();
          setTechstacks(techstacksData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Gagal memuat data');
      }
    };

    loadData();
  }, [router]);

  // Load project data
  useEffect(() => {
    if (!studentSession || !projectId) return;

    const loadProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }

        const projectData = await response.json();
        
        // Check if the project belongs to the current student
        if (projectData.student?.userId !== studentSession.id) {
          toast.error('Anda tidak memiliki akses untuk mengedit project ini');
          router.push('/app/profile');
          return;
        }

        setProject(projectData);
        
        // Set form data
        setFormData({
          title: projectData.title || '',
          description: projectData.description || '',
          githubUrl: projectData.githubUrl || '',
          liveDemoUrl: projectData.liveDemoUrl || '',
          categoryId: projectData.categoryId || '',
          techstackIds: projectData.projectTechstacks?.map((pt: any) => pt.techstackId) || [],
          thumbnailFile: null,
          mediaFiles: []
        });

        // Set selected techstacks
        setSelectedTechstacks(projectData.projectTechstacks?.map((pt: any) => pt.techstackId) || []);

      } catch (error) {
        console.error('Error loading project:', error);
        toast.error('Gagal memuat data project');
        router.push('/app/profile');
      } finally {
        setIsLoadingProject(false);
      }
    };

    loadProject();
  }, [projectId, studentSession, router]);

  const handleInputChange = (field: keyof FormData, value: any) => {
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
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File thumbnail terlalu besar (maksimal 5MB)');
        return;
      }
      handleInputChange('thumbnailFile', file);
    }
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit per file
        toast.error(`File ${file.name} terlalu besar (maksimal 10MB)`);
        return false;
      }
      return true;
    });

    if (formData.mediaFiles.length + validFiles.length > 5) {
      toast.error('Maksimal 5 file media');
      return;
    }

    handleInputChange('mediaFiles', [...formData.mediaFiles, ...validFiles]);
  };

  const removeMediaFile = (index: number) => {
    const newFiles = formData.mediaFiles.filter((_, i) => i !== index);
    handleInputChange('mediaFiles', newFiles);
  };

  // Delete confirmation handlers
  const handleDeleteThumbnail = () => {
    setDeleteType('thumbnail');
    setDeleteConfirmOpen(true);
  };

  const handleDeleteMedia = (index: number) => {
    setDeleteType('media');
    setDeleteMediaIndex(index);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteType === 'thumbnail') {
      setThumbnailDeleted(true);
      setFormData(prev => ({
        ...prev,
        thumbnailFile: null
      }));
      toast.success('Thumbnail berhasil dihapus');
    } else if (deleteType === 'media' && deleteMediaIndex >= 0) {
      setMediaDeleted(prev => [...prev, deleteMediaIndex]);
      setFormData(prev => ({
        ...prev,
        mediaFiles: prev.mediaFiles.filter((_, index) => index !== deleteMediaIndex)
      }));
      toast.success('Media berhasil dihapus');
    }
    setDeleteConfirmOpen(false);
    setDeleteMediaIndex(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Judul project harus diisi');
      return;
    }

    if (!formData.categoryId) {
      toast.error('Kategori harus dipilih');
      return;
    }

    if (selectedTechstacks.length === 0) {
      toast.error('Minimal pilih 1 tech stack');
      return;
    }

    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('githubUrl', formData.githubUrl);
      submitData.append('liveDemoUrl', formData.liveDemoUrl);
      submitData.append('categoryId', formData.categoryId);
      submitData.append('techstackIds', JSON.stringify(selectedTechstacks));

      if (formData.thumbnailFile) {
        submitData.append('thumbnail', formData.thumbnailFile);
      }

      formData.mediaFiles.forEach((file, index) => {
        submitData.append(`media_${index}`, file);
      });

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        body: submitData,
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      toast.success('Project berhasil diupdate!');
      router.push('/app/profile');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Gagal mengupdate project');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProject) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Project tidak ditemukan</p>
        </div>
      </div>
    );
  }

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
              <Label htmlFor="github" className="text-sm font-medium">
                GitHub Repository <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="github"
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
              <Label htmlFor="demo" className="text-sm font-medium">
                Live Demo URL
              </Label>
              <div className="relative">
                <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="demo"
                  placeholder="https://your-project-demo.com"
                  className="pl-10"
                  value={formData.liveDemoUrl}
                  onChange={(e) => handleInputChange('liveDemoUrl', e.target.value)}
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Kategori Project <span className="text-red-500">*</span>
              </Label>
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
              <Label className="text-sm font-medium">
                Tech Stack <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {techstacks.map((tech) => (
                  <div
                    key={tech.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedTechstacks.includes(tech.id)
                        ? 'border-primary bg-primary/5'
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
                      if (!tech) return null;
                      return (
                        <Badge
                          key={techId}
                          variant="secondary"
                          className="text-xs"
                          style={{
                            backgroundColor: tech.bgHex,
                            borderColor: tech.borderHex,
                            color: tech.textHex,
                          }}
                        >
                          {tech.name}
                          <X 
                            className="w-3 h-3 ml-1 cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTechstackToggle(techId);
                            }}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Thumbnail Project</Label>
              
              {/* Current Thumbnail Display */}
              {project?.thumbnailUrl && !thumbnailDeleted && (
                <div className="space-y-3">
                  <Label className="text-xs text-muted-foreground">Thumbnail Saat Ini:</Label>
                  <div className="relative inline-block group">
                    <div className="aspect-video w-48 rounded-lg overflow-hidden border bg-muted">
                      <Image
                        src={project.thumbnailUrl}
                        alt="Current thumbnail"
                        width={192}
                        height={108}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={handleDeleteThumbnail}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="thumbnail-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailUpload}
                />
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  {project?.thumbnailUrl ? 'Upload thumbnail baru untuk mengganti (maksimal 5MB)' : 'Klik untuk upload thumbnail (maksimal 5MB)'}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('thumbnail-upload')?.click()}
                >
                  {project?.thumbnailUrl ? 'Ganti Thumbnail' : 'Pilih File'}
                </Button>
              </div>
              
              {/* New Thumbnail Preview */}
              {formData.thumbnailFile && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Thumbnail Baru Terpilih:</Label>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-8 bg-background rounded border flex items-center justify-center">
                        <Upload className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span className="text-sm truncate">{formData.thumbnailFile.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, thumbnailFile: null }))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Media Upload */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Media Project (Opsional)</Label>
              
              {/* Current Media Display */}
              {project?.projectMedia && project.projectMedia.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-xs text-muted-foreground">Media Saat Ini:</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {project.projectMedia.map((media, index) => (
                      !mediaDeleted.includes(index) && (
                        <div key={index} className="relative group">
                          <div className="aspect-video rounded-lg overflow-hidden border bg-muted">
                            {media.mediaUrl.includes('.mp4') || media.mediaUrl.includes('.webm') ? (
                              <video
                                src={media.mediaUrl}
                                className="w-full h-full object-cover"
                                controls
                              />
                            ) : (
                              <Image
                                src={media.mediaUrl}
                                alt={`Media ${index + 1}`}
                                width={200}
                                height={120}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteMedia(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
              
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="media-upload"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleMediaUpload}
                />
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload gambar atau video tambahan (maksimal 5 file, 10MB per file)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('media-upload')?.click()}
                >
                  Tambah Media
                </Button>
              </div>

              {/* Selected Media Files */}
              {formData.mediaFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">File Media Baru Terpilih:</Label>
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
                          <X className="h-3 w-3" />
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
                    Mengupdate Project...
                  </>
                ) : (
                  'Update Project'
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
                ) : (project?.thumbnailUrl && !thumbnailDeleted) ? (
                  <Image
                    src={project.thumbnailUrl}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteType === 'thumbnail' 
                ? 'Apakah Anda yakin ingin menghapus thumbnail ini? Tindakan ini tidak dapat dibatalkan.'
                : 'Apakah Anda yakin ingin menghapus media ini? Tindakan ini tidak dapat dibatalkan.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}