import { Users, FolderOpen, Eye, Code2, Star } from "lucide-react";

interface StatsSectionProps {
  className?: string;
}

export function StatsSection({ className = "" }: StatsSectionProps) {
  return (
    <section className={`py-12 bg-white ${className}`}>
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-gray-800 text-[12px] font-medium mb-3">
              <Star className="w-3.5 h-3.5 mr-1.5 text-gray-700" strokeWidth={2} />
              Statistik
            </div>
            <h2 className="text-[28px] md:text-[32px] font-bold text-gray-900 mb-3 leading-tight">
              Pencapaian <span className="text-blue-600">Luar Biasa</span>
            </h2>
            <p className="text-[14px] text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Angka-angka yang menunjukkan dedikasi dan prestasi siswa RPL SMKN 4 Malang
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Stat 1 - Siswa Aktif */}
            <div className="text-center">
              <div className="text-[36px] md:text-[42px] font-bold text-blue-600 mb-1.5">
                6+
              </div>
              <div className="flex items-center justify-center text-[13px] text-gray-600">
                <Users className="w-3.5 h-3.5 mr-1.5" />
                Siswa Aktif
              </div>
            </div>

            {/* Stat 2 - Projects */}
            <div className="text-center">
              <div className="text-[36px] md:text-[42px] font-bold text-blue-600 mb-1.5">
                6+
              </div>
              <div className="flex items-center justify-center text-[13px] text-gray-600">
                <FolderOpen className="w-3.5 h-3.5 mr-1.5" />
                Projects
              </div>
            </div>

            {/* Stat 3 - Total Views */}
            <div className="text-center">
              <div className="text-[36px] md:text-[42px] font-bold text-blue-600 mb-1.5">
                8,220+
              </div>
              <div className="flex items-center justify-center text-[13px] text-gray-600">
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                Total Views
              </div>
            </div>

            {/* Stat 4 - Tech Skills */}
            <div className="text-center">
              <div className="text-[36px] md:text-[42px] font-bold text-blue-600 mb-1.5">
                28+
              </div>
              <div className="flex items-center justify-center text-[13px] text-gray-600">
                <Code2 className="w-3.5 h-3.5 mr-1.5" />
                Tech Skills
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
