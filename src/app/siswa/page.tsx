'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, Users, GraduationCap, Loader2 } from 'lucide-react';
import { StudentCard } from '@/components/student-card';
import { GuestNavbar } from '@/components/guest-navbar';

interface Student {
  id: string;
  fullName: string;
  bio: string | null;
  profilePhotoUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  className: string | null;
  skills: Array<{
    id: string;
    name: string;
    iconUrl: string | null;
    bgHex: string;
    borderHex: string;
    textHex: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string | null;
    thumbnailUrl: string | null;
    githubUrl: string;
    liveDemoUrl: string | null;
    categoryName: string | null;
    techstacks: Array<{
      id: string;
      name: string;
      iconUrl: string | null;
    }>;
  }>;
}

interface Class {
  id: string;
  name: string;
}

export default function SiswaPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 12;

  // Fetch classes for filter
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/classes');
        if (response.ok) {
          const data = await response.json();
          setClasses(data);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

  // Fetch students with pagination
  const fetchStudents = useCallback(async (pageNum: number, reset = false) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(selectedClass !== 'all' && { classId: selectedClass }),
      });

      const response = await fetch('/api/students?withRelations=true');
      if (response.ok) {
        const data = await response.json();
        
        if (reset || pageNum === 1) {
          setStudents(data);
        } else {
          setStudents(prev => [...prev, ...data]);
        }
        
        setHasMore(data.length === ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery, selectedClass]);

  // Initial load and when filters change
  useEffect(() => {
    setPage(1);
    fetchStudents(1, true);
  }, [fetchStudents]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000 &&
        !loadingMore &&
        hasMore
      ) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchStudents(nextPage);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, loadingMore, hasMore, fetchStudents]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchStudents(1, true);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedClass]);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = !searchQuery || 
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.skills.some(skill => skill.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesClass = selectedClass === 'all' || student.className === classes.find(c => c.id === selectedClass)?.name;
      
      return matchesSearch && matchesClass;
    });
  }, [students, searchQuery, selectedClass, classes]);

  return (
    <div className="min-h-screen bg-background">
      {/* Reusable Guest Navbar */}
      <GuestNavbar />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">Siswa CodePacker</h1>
          <p className="text-muted-foreground text-center mb-8">
            Temukan profil siswa dan project-project mereka yang menginspirasi
          </p>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <div className="flex-1">
              <Input
                placeholder="Cari siswa berdasarkan nama, bio, atau skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-96"></div>
              </div>
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchQuery || selectedClass !== 'all' 
                ? 'Tidak ada siswa yang sesuai dengan filter yang dipilih.'
                : 'Belum ada data siswa.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
            
            {/* Loading more indicator */}
            {loadingMore && (
              <div className="flex justify-center mt-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            
            {/* End of results indicator */}
            {!hasMore && filteredStudents.length > 0 && (
              <div className="text-center mt-8">
                <p className="text-muted-foreground">
                  Semua siswa telah ditampilkan ({filteredStudents.length} siswa)
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}