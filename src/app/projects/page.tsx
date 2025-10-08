'use client';

import { useState, useEffect, useCallback } from 'react';
import { GuestNavbar } from '@/components/guest-navbar';
import { ProjectCard } from '@/components/project-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch projects and categories in parallel
        const [projectsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/projects?page=1&limit=12'),
          fetch('/api/categories')
        ]);

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData.projects || []);
          setHasMore(projectsData.hasMore || false);
        }

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData.categories || []);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Load more projects for infinite scroll
  const loadMoreProjects = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      
      const response = await fetch(`/api/projects?page=${nextPage}&limit=12`);
      
      if (response.ok) {
        const data = await response.json();
        setProjects(prev => [...prev, ...(data.projects || [])]);
        setHasMore(data.hasMore || false);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more projects:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [page, loadingMore, hasMore]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMoreProjects();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreProjects]);

  // Filter projects based on search and category
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.student.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      project.category?.id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <GuestNavbar />
      
      <main className="container mx-auto px-4 lg:px-16 xl:px-24 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Katalog Project
          </h1>
          <p className="text-muted-foreground">
            Jelajahi berbagai project kreatif dan inovatif dari para siswa
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Cari project, deskripsi, atau nama siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-64">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
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
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-96"></div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-lg">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Tidak ada project yang sesuai dengan filter yang dipilih.'
                : 'Belum ada data project.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            
            {/* Loading more indicator */}
            {loadingMore && (
              <div className="flex justify-center mt-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            
            {/* End of results indicator */}
            {!hasMore && filteredProjects.length > 0 && (
              <div className="text-center mt-6">
                <p className="text-muted-foreground">
                  Semua project telah ditampilkan ({filteredProjects.length} project)
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}