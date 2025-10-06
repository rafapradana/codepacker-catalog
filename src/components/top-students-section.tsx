import { Users, Eye, FolderOpen, Github, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface TopStudentsSectionProps {
  className?: string;
}

export function TopStudentsSection({ className = "" }: TopStudentsSectionProps) {
  // Dummy data untuk UI
  const topStudents = [
    {
      id: "1",
      name: "Budi Santoso",
      class: "XII RPL B",
      bio: "Backend developer yang gemar dengan sistem database dan API development. Berpengalaman dengan berbagai...",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
      skills: ["Laravel", "Express.js", "MySQL", "+2"],
      projectCount: 7,
      totalViews: 1100,
      githubUrl: "https://github.com/budisantoso"
    },
    {
      id: "2",
      name: "Siti Nurhaliza",
      class: "XII RPL A",
      bio: "Frontend developer dengan passion di UI/UX design. Suka membuat interface yang menarik dan user-friendly...",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
      skills: ["React", "Tailwind", "Figma", "+3"],
      projectCount: 9,
      totalViews: 1450,
      githubUrl: "https://github.com/sitinurhaliza"
    },
    {
      id: "3",
      name: "Ahmad Fauzi",
      class: "XII RPL C",
      bio: "Full-stack developer yang tertarik dengan mobile development. Aktif berkontribusi di berbagai project...",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
      skills: ["React Native", "Node.js", "MongoDB", "+4"],
      projectCount: 8,
      totalViews: 1280,
      githubUrl: "https://github.com/ahmadfauzi"
    }
  ];

  return (
    <section className={`py-12 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-gray-800 text-[12px] font-medium mb-3 bg-white">
              <Users className="w-3.5 h-3.5 mr-1.5 text-gray-700" strokeWidth={2} />
              Siswa Terpopuler
            </div>
            <h2 className="text-[28px] md:text-[32px] font-bold text-gray-900 mb-3 leading-tight">
              Top Students
            </h2>
            <p className="text-[14px] text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Kenali para siswa RPL yang telah menunjukkan dedikasi dan prestasi luar biasa
            </p>
          </div>

          {/* Students Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {topStudents.map((student) => (
              <div key={student.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300">
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-24 h-24">
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
                  <h3 className="text-[16px] font-bold text-gray-900 mb-0.5">
                    {student.name}
                  </h3>
                  <p className="text-[12px] text-gray-600 font-medium">
                    {student.class}
                  </p>
                </div>

                {/* Bio */}
                <p className="text-[12px] text-gray-600 text-center mb-4 line-clamp-2 leading-relaxed">
                  {student.bio}
                </p>

                {/* Skills */}
                <div className="mb-4">
                  <div className="text-[11px] font-bold text-gray-900 mb-2">Skills</div>
                  <div className="flex flex-wrap gap-1.5">
                    {student.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-[11px] rounded-lg font-medium border border-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center text-gray-600">
                    <FolderOpen className="w-3 h-3 mr-1" />
                    <span className="text-[12px] font-medium">{student.projectCount} projects</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Eye className="w-3 h-3 mr-1" />
                    <span className="text-[12px] font-medium">{student.totalViews.toLocaleString()} views</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-lg text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <Github className="w-3 h-3 mr-1.5" />
                    GitHub
                  </button>
                  <Button asChild className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[12px] py-1.5 h-auto">
                    <Link href={`/students/${student.id}`}>
                      Lihat Profil
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Button asChild variant="outline" size="lg" className="rounded-lg px-6">
              <Link href="/students" className="flex items-center">
                Lihat Semua Siswa
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
