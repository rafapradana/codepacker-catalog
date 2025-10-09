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

export default function SearchPage() {
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
          fetch('/api/projects/search?page=1&limit=9'),
          fetch('/api/categories')
        ]);

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData.projects || []);
          setHasMore(projectsData.hasMore || false);
        }

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          // API mengembalikan array langsung, bukan object dengan property categories
          setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || []);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Search projects with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProjects();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory]);

  const searchProjects = async () => {
    try {
      setLoading(true);
      setPage(1);
      
      const params = new URLSearchParams({
        page: '1',
        limit: '9',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory !== 'all' && { categoryId: selectedCategory })
      });

      const response = await fetch(`/api/projects/search?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
        setHasMore(data.hasMore || false);
      }
    } catch (error) {
      console.error('Error searching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load more projects for infinite scroll
  const loadMoreProjects = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      
      const params = new URLSearchParams({
        page: nextPage.toString(),
        limit: '9',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory !== 'all' && { categoryId: selectedCategory })
      });

      const response = await fetch(`/api/projects/search?${params}`);
      
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
  }, [page, loadingMore, hasMore, searchQuery, selectedCategory]);

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

  return (
    <div className="p-4 lg:p-6">
      {/* Search Bar and Filter - Single Row */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full items-start">
          {/* Search Bar - Takes most of the width */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Cari berdasarkan nama project, deskripsi, atau nama siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-sm w-full border-input bg-background"
              />
            </div>
          </div>
          
          {/* Category Filter - Fixed width, not too wide */}
          <div className="w-full sm:w-48 flex-shrink-0">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-10 w-full border-input bg-background text-sm">
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
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Tidak ada project ditemukan
            </h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Coba ubah kata kunci pencarian atau filter kategori.'
                : 'Belum ada project yang tersedia.'}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Results count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {searchQuery || selectedCategory !== 'all' 
                ? `Menampilkan ${projects.length} project${searchQuery ? ` untuk "${searchQuery}"` : ''}`
                : `Menampilkan ${projects.length} project`}
            </p>
          </div>

          {/* Projects Grid - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          
          {/* Loading more indicator */}
          {loadingMore && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>Memuat lebih banyak project...</span>
              </div>
            </div>
          )}
          
          {/* End of results indicator */}
          {!hasMore && projects.length > 0 && (
            <div className="text-center mt-8">
              <p className="text-muted-foreground">
                Semua project telah ditampilkan ({projects.length} project)
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}