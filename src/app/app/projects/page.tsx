'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProjectCard } from '@/components/project-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FolderOpen } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  githubUrl: string;
  liveDemoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    fullName: string;
    profilePhotoUrl: string | null;
    classId: string | null;
    className: string | null;
  };
  category: {
    id: string;
    name: string;
    bgHex: string;
    borderHex: string;
    textHex: string;
  } | null;
  projectTechstacks: Array<{
    id: string;
    techstack: {
      id: string;
      name: string;
      iconUrl: string | null;
      bgHex: string;
      borderHex: string;
      textHex: string;
    };
  }>;
  projectMedia: Array<{
    id: string;
    mediaUrl: string;
    mediaType: string;
  }>;
}

interface Category {
  id: string;
  name: string;
  bgHex: string;
  borderHex: string;
  textHex: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [projectsRes, categoriesRes] = await Promise.all([
          fetch('/api/projects?limit=50'),
          fetch('/api/categories')
        ]);

        if (!projectsRes.ok) {
          throw new Error('Failed to fetch projects');
        }
        if (!categoriesRes.ok) {
          throw new Error('Failed to fetch categories');
        }

        const projectsData = await projectsRes.json();
        const categoriesData = await categoriesRes.json();

        setProjects(projectsData.projects || []);
        setCategories(categoriesData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter projects based on search term and category
  const filteredProjects = useCallback(() => {
    return projects.filter(project => {
      const matchesSearch = searchTerm === '' || 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.student.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        project.category?.id === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchTerm, selectedCategory]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-primary hover:underline"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  const filtered = filteredProjects();

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cari berdasarkan judul, deskripsi, atau nama siswa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FolderOpen className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {filtered.length} project{filtered.length !== 1 ? 's' : ''} ditemukan
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Tidak ada project ditemukan
            </h3>
            <p className="text-sm text-muted-foreground">
              Coba ubah kata kunci pencarian atau filter kategori
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                isStudentApp={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}