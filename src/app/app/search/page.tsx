'use client';

import { useState, useEffect } from 'react';
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

  // Fetch students and classes data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch students
        const studentsResponse = await fetch('/api/students');
        if (studentsResponse.ok) {
          const studentsData = await studentsResponse.json();
          setStudents(studentsData.students || []);
        }
        
        // Fetch classes
        const classesResponse = await fetch('/api/classes');
        if (classesResponse.ok) {
          const classesData = await classesResponse.json();
          setClasses(classesData.classes || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter students based on search and class
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.skills.some(skill => skill.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesClass = selectedClass === 'all' || student.class?.id === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Cari Profil Siswa</h1>
        </div>
        <p className="text-muted-foreground">
          Temukan dan jelajahi profil siswa RPL SMKN 4 Malang
        </p>
      </div>

      {/* Search Bar and Filter */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full items-start">
          {/* Search Bar */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Cari berdasarkan nama, username, atau skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-sm w-full border-input bg-background"
              />
            </div>
          </div>
          
          {/* Class Filter */}
          <div className="w-full sm:w-48 flex-shrink-0">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="h-10 w-full border-input bg-background text-sm">
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
        </div>
      </div>

      {/* Students Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
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
          {/* Results count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {searchQuery || selectedClass !== 'all' 
                ? `Menampilkan ${filteredStudents.length} siswa${searchQuery ? ` untuk "${searchQuery}"` : ''}`
                : `Menampilkan ${filteredStudents.length} siswa`}
            </p>
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}