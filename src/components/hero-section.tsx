import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FolderOpen, Users, Sparkles } from "lucide-react";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className = "" }: HeroSectionProps) {
  return (
    <section className={`relative py-12 lg:py-16 overflow-hidden ${className}`}>
      {/* Background - Simple clean white */}
      <div className="absolute inset-0 bg-white"></div>

      <div className="relative container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-600 rounded-full text-gray-800 text-[12px] font-medium mb-6">
            <Sparkles className="w-3 h-3 mr-1.5 text-gray-700" />
            Showcase Talenta Digital SMKN 4 Malang
          </div>

          {/* Main Heading */}
          <h1 className="text-[40px] md:text-[48px] lg:text-[56px] font-bold text-blue-600 mb-4 leading-[1.1] tracking-tight">
            Codepacker Catalog
          </h1>

          {/* Subtitle */}
          <p className="text-[14px] md:text-[15px] text-gray-700 mb-6 max-w-xl mx-auto leading-relaxed">
            Jelajahi portofolio digital siswa RPL SMKN 4 Malang. Dari aplikasi web inovatif hingga game interaktif - temukan karya-karya developer masa depan.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center items-center">
            <button className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-[13px] font-medium text-gray-800 hover:bg-gray-50 transition-colors">
              <FolderOpen className="mr-1.5 h-3.5 w-3.5" />
              Jelajahi Projects
            </button>
            <Button asChild className="rounded-lg px-4 py-2 h-auto text-[13px] font-semibold shadow-md bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/students" className="flex items-center">
                <Users className="mr-1.5 h-3.5 w-3.5" />
                Lihat Siswa
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
