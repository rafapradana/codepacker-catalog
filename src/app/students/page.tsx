"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Search, Users, Eye, FolderOpen, Github, Linkedin, Filter } from "lucide-react";
import { useState } from "react";

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showAllClasses, setShowAllClasses] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);

  // Mock data untuk siswa
  const allStudents = [
    {
      id: "1",
      name: "Ahmad Rizki Pratama",
      class: "XII RPL B",
      bio: "Passionate full-stack developer dengan fokus pada React dan Node.js. Suka membuat aplikasi web yang user-friendly.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      skills: ["React", "Node.js", "TypeScript", "MongoDB"],
      projectCount: 8,
      totalViews: 1250,
      githubUrl: "https://github.com/ahmadrizki",
      linkedinUrl: "https://linkedin.com/in/ahmadrizki"
    },
    {
      id: "2", 
      name: "Siti Nurhaliza",
      class: "XII RPL A",
      bio: "UI/UX Designer dan Frontend Developer yang passionate dengan design yang clean dan user experience yang intuitif.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      skills: ["Figma", "React", "Vue.js", "Tailwind"],
      projectCount: 9,
      totalViews: 980,
      githubUrl: "https://github.com/sitinurhaliza",
      linkedinUrl: "https://linkedin.com/in/sitinurhaliza"
    },
    {
      id: "3",
      name: "Budi Santoso", 
      class: "XII RPL B",
      bio: "Backend developer yang gemar dengan sistem database dan API development. Berpengalaman dengan berbagai framework.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      skills: ["Laravel", "Express.js", "MySQL", "PostgreSQL"],
      projectCount: 7,
      totalViews: 1100,
      githubUrl: "https://github.com/budisantoso",
      linkedinUrl: "https://linkedin.com/in/budisantoso"
    },
    {
      id: "4",
      name: "Dewi Sartika",
      class: "XI RPL B", 
      bio: "Mobile developer dengan passion di Flutter dan React Native. Suka membuat aplikasi mobile yang friendly.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      skills: ["Flutter", "React Native", "Dart", "Firebase"],
      projectCount: 5,
      totalViews: 850,
      githubUrl: "https://github.com/dewisartika",
      linkedinUrl: "https://linkedin.com/in/dewisartika"
    },
    {
      id: "5",
      name: "Eko Prasetyo",
      class: "XI RPL A",
      bio: "Game developer pemula yang antusias dengan Unity dan C#. Sedang belajar membuat game indie yang menarik.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      skills: ["Unity", "C#", "Blender", "Photoshop"],
      projectCount: 4,
      totalViews: 720,
      githubUrl: "https://github.com/ekoprasetyo",
      linkedinUrl: "https://linkedin.com/in/ekoprasetyo"
    },
    {
      id: "6",
      name: "Fatimah Zahra",
      class: "XI RPL A",
      bio: "Full-stack developer dengan minat khusus pada web development dan machine learning. Aktif berkontribusi di open source.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
      skills: ["Python", "Django", "JavaScript", "TensorFlow"],
      projectCount: 6,
      githubUrl: "https://github.com/fatimahzahra",
      linkedinUrl: "https://linkedin.com/in/fatimahzahra"
    }
  ];

  // Get unique classes and skills
  const uniqueClasses = Array.from(new Set(allStudents.map(student => student.class)));
  const allSkills = allStudents.flatMap(student => student.skills);
  const uniqueSkills = Array.from(new Set(allSkills));

  // Filter students based on search query and selected filters
  const filteredStudents = allStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesClass = selectedClasses.length === 0 || selectedClasses.includes(student.class);
    const matchesSkill = selectedSkills.length === 0 || 
                        student.skills.some(skill => selectedSkills.includes(skill));
    
    return matchesSearch && matchesClass && matchesSkill;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Header Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1.5 border border-blue-200 rounded-lg text-blue-800 text-[12px] font-medium mb-4 bg-blue-50">
              <Users className="w-3.5 h-3.5 mr-1.5 text-blue-700" strokeWidth={2} />
              Siswa RPL SMKN 4 Malang
            </div>
            <h1 className="text-[36px] md:text-[42px] font-bold text-gray-900 mb-4 leading-tight font-poppins">
              Developer <span className="text-blue-600">Masa Depan</span>
            </h1>
            <p className="text-[16px] text-gray-600 max-w-2xl mx-auto leading-relaxed font-inter">
              Kenali para siswa RPL SMKN 4 Malang yang telah menunjukkan dedikasi dan 
              prestasi luar biasa dalam dunia programming.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Cari siswa berdasarkan nama, bio, kelas, atau skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
              />
            </div>

            {/* Filter Tags */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Class Filters */}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 font-inter">Kelas:</span>
                  </div>
                  <button
                    onClick={() => setSelectedClasses([])}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors font-inter ${
                      selectedClasses.length === 0
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Semua
                  </button>
                  {(showAllClasses ? uniqueClasses : uniqueClasses.slice(0, 3)).map(className => (
                    <button
                      key={className}
                      onClick={() => {
                        if (selectedClasses.includes(className)) {
                          setSelectedClasses(selectedClasses.filter(c => c !== className));
                        } else {
                          setSelectedClasses([...selectedClasses, className]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors font-inter ${
                        selectedClasses.includes(className)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {className}
                    </button>
                  ))}
                  {uniqueClasses.length > 3 && (
                    <button
                      onClick={() => setShowAllClasses(!showAllClasses)}
                      className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors font-inter bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                    >
                      {showAllClasses ? `Sembunyikan` : `+${uniqueClasses.length - 3} lainnya`}
                    </button>
                  )}
                </div>
              </div>

              {/* Skill Filters */}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-700 font-inter">Skill:</span>
                  <button
                    onClick={() => setSelectedSkills([])}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors font-inter ${
                      selectedSkills.length === 0
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Semua
                  </button>
                  {(showAllSkills ? uniqueSkills : uniqueSkills.slice(0, 5)).map(skill => (
                    <button
                      key={skill}
                      onClick={() => {
                        if (selectedSkills.includes(skill)) {
                          setSelectedSkills(selectedSkills.filter(s => s !== skill));
                        } else {
                          setSelectedSkills([...selectedSkills, skill]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors font-inter ${
                        selectedSkills.includes(skill)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                  {uniqueSkills.length > 5 && (
                    <button
                      onClick={() => setShowAllSkills(!showAllSkills)}
                      className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors font-inter bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                    >
                      {showAllSkills ? `Sembunyikan` : `+${uniqueSkills.length - 5} lainnya`}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div>
              <p className="text-sm text-gray-600 font-inter">
                {filteredStudents.length} dari {allStudents.length} siswa ditampilkan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Students Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {filteredStudents.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                      <div className="relative w-20 h-20">
                        <Image
                          src={student.avatar}
                          alt={student.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Name & Class */}
                    <div className="text-center mb-3">
                      <h3 className="text-[18px] font-bold text-gray-900 mb-1 font-poppins">
                        {student.name}
                      </h3>
                      <p className="text-[13px] text-gray-600 font-medium font-inter">
                        {student.class}
                      </p>
                    </div>

                    {/* Bio */}
                    <p className="text-[13px] text-gray-600 text-center mb-4 line-clamp-2 leading-relaxed font-inter">
                      {student.bio}
                    </p>

                    {/* Skills */}
                    <div className="mb-4">
                      <div className="text-[12px] font-bold text-gray-900 mb-2 font-poppins">Skills</div>
                      <div className="flex flex-wrap gap-1.5">
                        {student.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-[11px] rounded-lg font-medium border border-blue-100 font-inter"
                          >
                            {skill}
                          </span>
                        ))}
                        {student.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-[11px] rounded-lg font-medium border border-gray-200 font-inter">
                            +{student.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center text-gray-600">
                        <FolderOpen className="w-3 h-3 mr-1" />
                        <span className="text-[12px] font-medium font-inter">{student.projectCount} projects</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Eye className="w-3 h-3 mr-1" />
                        <span className="text-[12px] font-medium font-inter">{(student.totalViews || 0).toLocaleString()} views</span>
                      </div>
                    </div>

                    {/* GitHub Link */}
                    <div className="mb-4">
                      <Link 
                        href={student.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-lg text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition-colors font-inter"
                      >
                        <Github className="w-3 h-3 mr-1.5" />
                        GitHub
                      </Link>
                    </div>

                    {/* View Profile Button */}
                    <Button asChild className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[13px] py-2 h-auto font-inter">
                      <Link href={`/students/${student.id}`}>
                        Lihat Profil
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">Tidak ada siswa ditemukan</h3>
                <p className="text-gray-600 mb-4 font-inter">Coba ubah kata kunci pencarian atau filter yang digunakan.</p>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedClasses([]);
                    setSelectedSkills([]);
                    setShowAllClasses(false);
                    setShowAllSkills(false);
                  }}
                  variant="outline"
                  className="font-inter"
                >
                  Reset Filter
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
