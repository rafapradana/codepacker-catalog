"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import { useState } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["700"],
  subsets: ["latin"],
});

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedTechnology, setSelectedTechnology] = useState("Semua");

  // Categories
  const categories = [
    "Semua",
    "Game",
    "Mobile",
    "Web"
  ];

  // Technologies
  const technologies = [
    "Semua",
    "C#",
    "Dart",
    "Django",
    "Express.js",
    "Flutter",
    "JWT",
    "Laravel",
    "Matplotlib"
  ];

  // Mock projects data - sesuai dengan desain
  const projects = [
    {
      id: "1",
      title: "Weather Prediction ML",
      description: "Aplikasi prediksi cuaca menggunakan machine learning dengan data historis dan algoritma neural network untuk akurasi tinggi.",
      thumbnail: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400&h=300&fit=crop",
      studentName: "Izzamah Zahra",
      studentId: "1",
      profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      githubUrl: "https://github.com",
      liveDemoUrl: "https://demo.com",
      techStacks: ["Python", "TensorFlow", "Django"],
      category: "Web",
      status: "Web",
      views: 820
    },
    {
      id: "2",
      title: "E-Commerce Dashboard",
      description: "Dashboard admin e-commerce dengan fitur analitik data penjualan, manajemen produk, dan inventory tracking.",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      studentName: "Ahmad Rizki Pratama",
      studentId: "2",
      profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      githubUrl: "https://github.com",
      liveDemoUrl: "https://demo.com",
      techStacks: ["React", "TypeScript", "Node.js"],
      category: "Web",
      status: "Web",
      views: 1240
    },
    {
      id: "3",
      title: "Platformer Game 2D",
      description: "Game platformer 2D retro style dengan mekanik lompat, power-ups, dan sistem scoring.",
      thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop",
      studentName: "Eko Prasetyo",
      studentId: "3",
      profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      githubUrl: "https://github.com",
      liveDemoUrl: "https://demo.com",
      techStacks: ["Unity", "C#", "Photoshop"],
      category: "Game",
      status: "Mobile",
      views: 2410
    },
    {
      id: "4",
      title: "Task Management App",
      description: "Aplikasi task management untuk tim dengan fitur drag & drop, deadline tracking, dan kolaborasi tim.",
      thumbnail: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop",
      studentName: "Siti Nurhaliza",
      studentId: "4",
      profilePhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      githubUrl: "https://github.com",
      liveDemoUrl: "https://demo.com",
      techStacks: ["Vue.js", "Firebase", "MongoDB"],
      category: "Web",
      status: "Web",
      views: 1650
    },
    {
      id: "5",
      title: "School Library API",
      description: "REST API untuk sistem perpustakaan sekolah dengan fitur peminjaman buku, denda, dan laporan.",
      thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      studentName: "Budi Santoso",
      studentId: "5",
      profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      githubUrl: "https://github.com",
      liveDemoUrl: "https://demo.com",
      techStacks: ["Laravel", "MySQL", "JWT"],
      category: "Web",
      status: "Web",
      views: 1320
    },
    {
      id: "6",
      title: "Expense Tracker Mobile",
      description: "Aplikasi mobile untuk tracking pengeluaran harian dengan grafik dan kategori.",
      thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop",
      studentName: "Dewi Kartika",
      studentId: "6",
      profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      githubUrl: "https://github.com",
      liveDemoUrl: "https://demo.com",
      techStacks: ["Flutter", "Kotlin", "SQLite"],
      category: "Mobile",
      status: "Mobile",
      views: 2040
    }
  ];

  // Filter projects based on search, category, and technology
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "Semua" || 
      project.category === selectedCategory;

    const matchesTechnology = 
      selectedTechnology === "Semua" ||
      project.techStacks.some(tech => tech === selectedTechnology);

    return matchesSearch && matchesCategory && matchesTechnology;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-12 pb-10 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full mb-3">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-medium text-blue-600">Projects Siswa RPL</span>
          </div>

          {/* Title */}
          <h1 className={`text-4xl md:text-5xl font-bold mb-5 ${poppins.className}`}>
            Karya <span className="text-blue-600">Inovatif</span> Siswa
          </h1>

          {/* Description */}
          <p className="text-sm text-gray-600 max-w-3xl mx-auto">
            Jelajahi berbagai project menarik yang telah dibuat oleh siswa RPL SMKN 4 Malang 
            dari berbagai kategori dan teknologi.
          </p>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari project berdasarkan nama, deskripsi, author, atau teknologi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-base rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Category Filters */}
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 pt-2 min-w-fit">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">Kategori:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full transition-all ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-white text-gray-900 hover:bg-gray-50 border-gray-300"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Technology Filters */}
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 pt-2 min-w-fit">
                <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">Teknologi:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <Button
                    key={tech}
                    variant={selectedTechnology === tech ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTechnology(tech)}
                    className={`rounded-full transition-all ${
                      selectedTechnology === tech
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-white text-gray-900 hover:bg-gray-50 border-gray-300"
                    }`}
                  >
                    {tech}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Results count */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <p className="text-gray-600">
              {filteredProjects.length === 0 ? (
                "0 dari 0 projects ditampilkan"
              ) : (
                `${filteredProjects.length} dari ${projects.length} projects ditampilkan`
              )}
            </p>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tidak ada project ditemukan
              </h3>
              <p className="text-gray-600">
                Coba ubah kata kunci pencarian atau filter kategori
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  {...project}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
