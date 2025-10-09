'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { StudentCard } from '@/components/student-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users } from 'lucide-react';

interface Student {
  id: string;
  fullName: string;
  bio?: string | null;
  profilePhotoUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  } | null;
  class?: {
    id: string;
    name: string;
  } | null;
  skills: {
    id: string;
    name: string;
    iconUrl: string | null;
    bgHex: string;
    borderHex: string;
    textHex: string;
  }[];
}

interface Class {
  id: string;
  name: string;
}

export default function SearchPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [displayedStudents, setDisplayedStudents] = useState<Student[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const ITEMS_PER_PAGE = 12;

  // Fetch students and classes data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch students
        const studentsResponse = await fetch('/api/students?withRelations=true');
        if (studentsResponse.ok) {
          const studentsData = await studentsResponse.json();
          setStudents(studentsData || []);
        }
        
        // Fetch classes
        const classesResponse = await fetch('/api/classes');
        if (classesResponse.ok) {
          const classesData = await classesResponse.json();
          setClasses(classesData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter students based on search query and selected class
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = !searchQuery || 
                           student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           student.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           student.skills.some(skill => skill.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesClass = selectedClass === 'all' || student.class?.id === selectedClass;
      
      return matchesSearch && matchesClass;
    });
  }, [students, searchQuery, selectedClass]);

  // Load more students for infinite scroll
  const loadMoreStudents = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    
    setTimeout(() => {
      setDisplayedStudents(prev => {
        const currentLength = prev.length;
        const nextItems = filteredStudents.slice(currentLength, currentLength + ITEMS_PER_PAGE);
        
        if (nextItems.length === 0) {
          setHasMore(false);
          return prev;
        } else {
          setHasMore(currentLength + nextItems.length < filteredStudents.length);
          return [...prev, ...nextItems];
        }
      });
      
      setIsLoadingMore(false);
    }, 500); // Simulate loading delay
  }, [filteredStudents, hasMore, isLoadingMore]);

  // Reset displayed students when filters change
  useEffect(() => {
    const initialItems = filteredStudents.slice(0, ITEMS_PER_PAGE);
    setDisplayedStudents(initialItems);
    setHasMore(filteredStudents.length > ITEMS_PER_PAGE);
  }, [filteredStudents]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreStudents();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore]); // Removed loadMoreStudents from dependencies

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cari berdasarkan nama, username, atau skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Pilih kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kelas</SelectItem>
            {classes.map((classItem) => (
              <SelectItem key={classItem.id} value={classItem.id}>
                {classItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {loading ? 'Memuat...' : `${filteredStudents.length} siswa ditemukan`}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-80"></div>
              </div>
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Tidak ada siswa ditemukan
              </h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedClass !== 'all' 
                  ? 'Coba ubah kata kunci pencarian atau filter kelas.'
                  : 'Belum ada data siswa yang tersedia.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {displayedStudents.map((student) => (
                <StudentCard key={student.id} student={student} isStudentApp={true} />
              ))}
            </div>
            
            {/* Loading more indicator */}
            {isLoadingMore && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-lg h-80"></div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Intersection observer target */}
            {hasMore && !isLoadingMore && (
              <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Scroll untuk memuat lebih banyak...</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}