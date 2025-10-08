"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { Github, ExternalLink, Mail, Instagram, Briefcase, Eye, Code2 } from "lucide-react";
import { notFound } from "next/navigation";
import { useState, useMemo, use } from "react";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  githubUrl: string;
  demoUrl: string;
  views: number;
  stars: number;
  category?: string;
  date?: string;
}

interface Student {
  id: string;
  name: string;
  class: string;
  bio: string;
  avatar: string;
  bannerImage?: string;
  skills: string[];
  email: string;
  instagram: string;
  location: string;
  joinDate: string;
  githubUrl: string;
  linkedinUrl: string;
  instagramUrl?: string;
  portfolioUrl: string;
  totalProjects: number;
  totalViews: number;
  totalStars: number;
  projects: Project[];
}

interface StudentProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function StudentProfilePage({ params }: StudentProfilePageProps) {
  const { id } = use(params);
  // Mock data untuk detail siswa - dalam implementasi nyata, ini akan fetch dari database
  const studentData = {
    "1": {
      id: "1",
      name: "Ahmad Rizki Pratama",
      class: "XII RPL B",
      bio: "Full-stack developer with a passion for creating intuitive and performant web applications. Experienced in React ecosystem and modern web technologies.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bannerImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=300&fit=crop",
      skills: ["React", "Node.js", "TypeScript", "JavaScript", "Figma"],
      email: "ahmad.rizki@smkn4malang.sch.id",
      instagram: "@ahmadrizki",
      location: "Malang, Jawa Timur",
      joinDate: "September 2022",
      githubUrl: "https://github.com/ahmadrizki",
      linkedinUrl: "https://linkedin.com/in/ahmadrizki",
      portfolioUrl: "https://ahmadrizki.dev",
      totalProjects: 12,
      totalViews: 2450,
      totalStars: 89,
      projects: [
        {
          id: "1",
          title: "E-Commerce Dashboard",
          description: "Dashboard admin untuk mengelola toko online dengan fitur analytics, inventory management, dan order processing.",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
          techStack: ["React", "TypeScript", "Node.js", "K2"],
          githubUrl: "https://github.com/ahmadrizki/ecommerce-dashboard",
          demoUrl: "https://ecommerce-dashboard-demo.vercel.app",
          views: 450,
          stars: 23,
          category: "Game UI"
        },
        {
          id: "6",
          title: "E-Commerce Dashboard",
          description: "Dashboard admin untuk mengelola toko online dengan fitur analytics, inventory management, dan order processing.",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
          techStack: ["React", "TypeScript", "Node.js", "K2"],
          githubUrl: "https://github.com/ahmadrizki/ecommerce-dashboard",
          demoUrl: "https://ecommerce-dashboard-demo.vercel.app",
          views: 450,
          stars: 23,
          category: "Game UI"
        },
        {
          id: "2", 
          title: "E-Commerce Dashboard",
          description: "Dashboard admin untuk mengelola toko online dengan fitur analytics, inventory management, dan order processing.",
          image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
          techStack: ["React", "TypeScript", "Node.js", "K2"],
          githubUrl: "https://github.com/ahmadrizki/task-manager",
          demoUrl: "https://task-manager-demo.vercel.app",
          views: 320,
          stars: 18,
          category: "Web"
        },
        {
          id: "7", 
          title: "E-Commerce Dashboard",
          description: "Dashboard admin untuk mengelola toko online dengan fitur analytics, inventory management, dan order processing.",
          image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
          techStack: ["React", "TypeScript", "Node.js", "K2"],
          githubUrl: "https://github.com/ahmadrizki/task-manager",
          demoUrl: "https://task-manager-demo.vercel.app",
          views: 320,
          stars: 18,
          category: "Web"
        },
        {
          id: "3",
          title: "E-Commerce Dashboard",
          description: "Dashboard admin untuk mengelola toko online dengan fitur analytics, inventory management, dan order processing.",
          image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=250&fit=crop",
          techStack: ["React", "TypeScript", "Node.js", "K2"],
          githubUrl: "https://github.com/ahmadrizki/weather-app",
          demoUrl: "https://weather-app-demo.vercel.app",
          views: 280,
          stars: 15,
          category: "App"
        },
        {
          id: "4",
          title: "E-Commerce Dashboard",
          description: "Dashboard admin untuk mengelola toko online dengan fitur analytics, inventory management, dan order processing.",
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
          techStack: ["React", "TypeScript", "Node.js", "K2"],
          githubUrl: "https://github.com/ahmadrizki/lms-platform",
          demoUrl: "https://lms-demo.vercel.app",
          views: 520,
          stars: 31,
          category: "Game"
        },
        {
          id: "5",
          title: "E-Commerce Dashboard",
          description: "Dashboard admin untuk mengelola toko online dengan fitur analytics, inventory management, dan order processing.",
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
          techStack: ["React", "TypeScript", "Node.js", "K2"],
          githubUrl: "https://github.com/ahmadrizki/lms-platform",
          demoUrl: "https://lms-demo.vercel.app",
          views: 520,
          stars: 31,
          category: "Game"
        }
      ]
    },
    "2": {
      id: "2",
      name: "Siti Nurhaliza",
      class: "XII RPL A",
      bio: "UI/UX Designer dan Frontend Developer yang passionate dengan design yang clean dan user experience yang intuitif.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      bannerImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=300&fit=crop",
      skills: ["Figma", "React", "Vue.js", "Tailwind CSS", "Adobe XD"],
      email: "siti.nurhaliza@smkn4malang.sch.id",
      instagram: "@sitinurhaliza",
      location: "Malang, Jawa Timur",
      joinDate: "September 2022",
      githubUrl: "https://github.com/sitinurhaliza",
      linkedinUrl: "https://linkedin.com/in/sitinurhaliza",
      portfolioUrl: "https://sitinurhaliza.design",
      totalProjects: 8,
      totalViews: 1890,
      totalStars: 67,
      projects: [
        {
          id: "1",
          title: "Design System Library",
          description: "Comprehensive design system dengan komponen reusable untuk aplikasi web dan mobile.",
          image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=250&fit=crop",
          techStack: ["Figma", "React", "Storybook", "Tailwind"],
          githubUrl: "https://github.com/sitinurhaliza/design-system",
          demoUrl: "https://design-system-demo.vercel.app",
          views: 380,
          stars: 25,
          category: "Web"
        }
      ]
    }
  };

  const student: Student = studentData[id as keyof typeof studentData] as Student;

  if (!student) {
    notFound();
  }

  // State for filters and pagination
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const projectsPerPage = 6;
  
  // Available project categories
  const categories = ["Semua", "Game UI", "Web", "App", "Game", "Other"];

  // Filter projects based on selected category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "Semua") {
      return student.projects;
    }
    return student.projects.filter((project: Project) => 
      project.category === selectedCategory
    );
  }, [student.projects, selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  // Reset to page 1 when category changes
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

      {/* Banner with Profile Picture Overlap */}
      <div className="relative">
        {/* Blue Banner - Can contain an image */}
        <div className="h-44 bg-blue-600 relative overflow-hidden">
          {student.bannerImage && (
            <Image
              src={student.bannerImage}
              alt="Profile banner"
              fill
              className="object-cover opacity-40"
            />
          )}
        </div>

        {/* Profile Picture Overlapping */}
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative -mt-20 pb-6">
              <div className="w-36 h-36 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                <Image
                  src={student.avatar}
                  alt={student.name}
                  width={144}
                  height={144}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="container mx-auto px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Student Name and Class */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1 font-poppins">{student.name}</h1>
            <p className="text-base text-gray-600 font-inter">{student.class}</p>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Left Column - About Section */}
            <div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 font-poppins">About</h2>
                
                {/* Bio */}
                <div className="mb-4">
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 leading-relaxed font-inter">
                      {student.bio}
                    </p>
                  </div>
                </div>

                {/* GitHub */}
                <div className="mb-3">
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <a 
                      href={student.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline font-inter truncate"
                    >
                      {student.githubUrl.replace('https://github.com/', '')}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 font-inter truncate">
                      {student.email}
                    </span>
                  </div>
                </div>

                {/* Instagram */}
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <a 
                      href={`https://instagram.com/${student.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline font-inter"
                    >
                      {student.instagram}
                    </a>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 font-poppins">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {student.skills.map((skill) => (
                      <span 
                        key={skill}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium border border-blue-100 font-inter"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Projects Section */}
            <div>
              {/* Project Filter Tabs */}
              <div className="mb-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-700 font-inter">Kategori:</span>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors font-inter ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category === "Semua" ? `Semua (${student.projects.length})` : category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentProjects.map((project: Project) => (
                  <div key={project.id} className="group">
                    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
                      {/* Project Image with Overlays */}
                      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                        
                        {/* Category Tag - Top Left */}
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-white text-gray-800 text-xs font-medium rounded-md shadow-sm font-inter">
                            {project.category || 'Web'}
                          </span>
                        </div>
                        
                        {/* Views Count - Top Right */}
                        <div className="absolute top-3 right-3">
                          <div className="flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-md">
                            <Eye className="w-3.5 h-3.5" />
                            <span className="font-inter">{project.views}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Project Info */}
                      <div className="p-4">
                        <h3 className="text-base font-semibold text-gray-900 mb-2 font-poppins">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 font-inter line-clamp-2">
                          {project.description}
                        </p>
                        
                        {/* Tech Stack */}
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-900 mb-2.5 font-poppins">Tech Stack</p>
                          <div className="flex flex-wrap gap-2">
                            {project.techStack.slice(0, 3).map((tech: string, index: number) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium border border-blue-100 font-inter"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.techStack.length > 3 && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium border border-blue-100 font-inter">
                                +{project.techStack.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 mb-3">
                          <a 
                            href={project.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-inter"
                          >
                            <Code2 className="w-4 h-4" />
                            <span>Code</span>
                          </a>
                          <a 
                            href={project.demoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-inter"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Demo</span>
                          </a>
                        </div>
                        
                        {/* View Detail Button */}
                        <Link
                          href={`/projects/${project.id}`}
                          className="block w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-inter"
                        >
                          Lihat Detail
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-inter"
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors font-inter ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-inter"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
