import Link from "next/link";
import { Github, Instagram, Mail } from "lucide-react";

interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`bg-gray-50 border-t border-gray-200 ${className}`}>
      <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
              <span className="text-xl font-bold font-poppins text-blue-600">Codepacker</span>
            </div>
            <p className="text-gray-600 text-sm font-inter leading-relaxed">
              Platform modern untuk menampilkan katalog dan portofolio siswa RPL SMKN 4 Malang.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="font-semibold mb-4 text-base font-poppins text-gray-900">Navigasi</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-inter">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/students" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-inter">
                  Siswa
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-inter">
                  Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Kategori */}
          <div>
            <h3 className="font-semibold mb-4 text-base font-poppins text-gray-900">Kategori</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/projects?category=web" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-inter">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/projects?category=mobile" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-inter">
                  Mobile Development
                </Link>
              </li>
              <li>
                <Link href="/projects?category=game" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-inter">
                  Game Development
                </Link>
              </li>
              <li>
                <Link href="/projects?category=desktop" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-inter">
                  Desktop Application
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="font-semibold mb-4 text-base font-poppins text-gray-900">Kontak</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-600" />
                <Link 
                  href="mailto:info@smkn4malang.sch.id"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-inter"
                >
                  info@smkn4malang.sch.id
                </Link>
              </div>
              <div className="flex items-center space-x-3 mt-4">
                <Link 
                  href="https://github.com/rafapradana/codepacker-catalog" 
                  target="_blank"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </Link>
                <Link 
                  href="https://instagram.com" 
                  target="_blank"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm font-inter">
            © 2024 SMKN 4 Malang. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm font-inter mt-2 md:mt-0">
            Made with <span className="text-red-500">❤️</span> by RPL Students
          </p>
        </div>
      </div>
    </footer>
  );
}
