import { Code2, Users, Lightbulb, Target } from "lucide-react";

interface AboutSectionProps {
  className?: string;
}

export function AboutSection({ className = "" }: AboutSectionProps) {
  return (
    <section className={`py-12 bg-white ${className}`}>
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-gray-800 text-[12px] font-medium mb-3">
              <Target className="w-3.5 h-3.5 mr-1.5 text-gray-700" strokeWidth={2} />
              Tentang Kami
            </div>
            <h2 className="text-[28px] md:text-[32px] font-bold text-gray-900 mb-3 leading-tight">
              Platform Showcase untuk <span className="text-blue-600">Talenta Digital</span>
            </h2>
            <p className="text-[14px] text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Codepacker Catalog adalah platform yang dirancang khusus untuk menampilkan karya-karya terbaik siswa 
              RPL SMKN 4 Malang. Kami percaya bahwa setiap siswa memiliki potensi untuk menjadi developer yang luar biasa.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {/* Card 1 - Showcase Projects */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Code2 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-[16px] font-bold text-gray-900 mb-2">
                Showcase Projects
              </h3>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                Menampilkan project-project terbaik dari berbagai kategori: Web, Mobile, Game, Desktop, dan CLI.
              </p>
            </div>

            {/* Card 2 - Profil Siswa */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-[16px] font-bold text-gray-900 mb-2">
                Profil Siswa
              </h3>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                Mengenal lebih dekat dengan para developer muda berbakat beserta skill dan pencapaian mereka.
              </p>
            </div>

            {/* Card 3 - Inspirasi */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-[16px] font-bold text-gray-900 mb-2">
                Inspirasi
              </h3>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                Memberikan inspirasi dan motivasi bagi siswa lain untuk terus berkarya dan mengembangkan kemampuan coding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
