import { FolderOpen, Eye, Code, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface TopProjectsSectionProps {
  className?: string;
}

export function TopProjectsSection({ className = "" }: TopProjectsSectionProps) {
  // Dummy data untuk UI
  const topProjects = [
    {
      id: "1",
      title: "Weather Prediction ML",
      description: "Aplikasi prediksi cuaca menggunakan machine learning dengan data historis dan...",
      category: "Web",
      categoryColor: "bg-orange-100 text-orange-700",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop",
      views: 520,
      techStack: ["Python", "TensorFlow", "Django", "+2"],
      author: {
        name: "Fatimah Zahra",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatimah",
        date: "20 Februari 2024"
      }
    },
    {
      id: "2",
      title: "E-Commerce Dashboard",
      description: "Dashboard admin untuk mengelola toko online dengan fitur analytics, inventory...",
      category: "Web",
      categoryColor: "bg-orange-100 text-orange-700",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      views: 450,
      techStack: ["React", "TypeScript", "Node.js", "+2"],
      author: {
        name: "Ahmad Rizki Pratama",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
        date: "16 Januari 2024"
      }
    },
    {
      id: "3",
      title: "Platformer Game 2D",
      description: "Game platformer 2D dengan multiple levels, power-ups, dan sistem scoring.",
      category: "Game",
      categoryColor: "bg-purple-100 text-purple-700",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop",
      views: 410,
      techStack: ["Unity", "C#", "Photoshop"],
      author: {
        name: "Eko Prasetyo",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eko",
        date: "10 Februari 2024"
      }
    }
  ];

  return (
    <section className={`py-12 bg-white ${className}`}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-gray-800 text-[12px] font-medium mb-3 bg-white">
              <FolderOpen className="w-3.5 h-3.5 mr-1.5 text-gray-700" strokeWidth={2} />
              Projects Terpopuler
            </div>
            <h2 className="text-[28px] md:text-[32px] font-bold text-gray-900 mb-3 leading-tight">
              Top Projects
            </h2>
            <p className="text-[14px] text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Jelajahi project-project inovatif yang telah dibuat oleh siswa RPL SMKN 4 Malang
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {topProjects.map((project) => (
              <div key={project.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Project Image */}
                <div className="relative h-40 bg-gray-100">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-0.5 ${project.categoryColor} rounded-full text-[11px] font-medium`}>
                      {project.category}
                    </span>
                  </div>
                  {/* Views Badge */}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-full flex items-center">
                    <Eye className="w-2.5 h-2.5 text-white mr-1" />
                    <span className="text-white text-[11px] font-medium">{project.views}</span>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-4">
                  {/* Title */}
                  <h3 className="text-[15px] font-bold text-gray-900 mb-1.5">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[12px] text-gray-600 mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="mb-3">
                    <div className="text-[11px] font-semibold text-gray-700 mb-1.5">Tech Stack</div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[11px] rounded-md font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Author */}
                  <div className="flex items-center mb-3 pb-3 border-b border-gray-100">
                    <Image
                      src={project.author.avatar}
                      alt={project.author.name}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                    <div className="ml-2">
                      <div className="text-[12px] font-semibold text-gray-900">
                        {project.author.name}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        📅 {project.author.date}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mb-2">
                    <button className="flex-1 flex items-center justify-center px-2 py-1.5 border border-gray-300 rounded-lg text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <Code className="w-3 h-3 mr-1" />
                      Code
                    </button>
                    <button className="flex-1 flex items-center justify-center px-2 py-1.5 border border-gray-300 rounded-lg text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Demo
                    </button>
                  </div>

                  {/* View Detail Button */}
                  <Button asChild className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[12px] py-1.5 h-auto">
                    <Link href={`/projects/${project.id}`}>
                      Lihat Detail
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Button asChild variant="outline" size="lg" className="rounded-lg px-6">
              <Link href="/projects" className="flex items-center">
                Lihat Semua Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
