"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, Code2 } from "lucide-react";
import { usePathname } from "next/navigation";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className = "" }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={`sticky top-0 z-50 py-5 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <Code2 className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[19px] font-bold text-blue-600">Codepacker</span>
          </Link>

          {/* Desktop Navigation - Glass effect - Centered absolutely */}
          <div className="hidden md:flex items-center bg-white/40 backdrop-blur-xl border border-white/20 shadow-lg rounded-full px-1.5 py-1.5 absolute left-1/2 -translate-x-1/2">
            <Link 
              href="/" 
              className={`px-5 py-2 rounded-full text-[15px] font-medium transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-white/90 backdrop-blur-md text-blue-600 shadow-md' 
                  : 'text-gray-800 hover:text-blue-600'
              }`}
            >
              Beranda
            </Link>
            <Link 
              href="/students" 
              className={`px-5 py-2 rounded-full text-[15px] font-medium transition-all duration-200 ${
                isActive('/students') 
                  ? 'bg-white/90 backdrop-blur-md text-blue-600 shadow-md' 
                  : 'text-gray-800 hover:text-blue-600'
              }`}
            >
              Siswa
            </Link>
            <Link 
              href="/projects" 
              className={`px-5 py-2 rounded-full text-[15px] font-medium transition-all duration-200 ${
                isActive('/projects') 
                  ? 'bg-white/90 backdrop-blur-md text-blue-600 shadow-md' 
                  : 'text-gray-800 hover:text-blue-600'
              }`}
            >
              Projects
            </Link>
          </div>

          {/* Desktop Auth Button */}
          <div className="hidden md:flex items-center">
            <Button asChild className="rounded-full px-6 py-2.5 h-auto text-[14px] font-semibold shadow-md bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/login">Login</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/20">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className={`px-4 py-2.5 rounded-full text-[15px] font-medium transition-all ${
                  isActive('/') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-800 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link 
                href="/students" 
                className={`px-4 py-2.5 rounded-full text-[15px] font-medium transition-all ${
                  isActive('/students') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-800 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Siswa
              </Link>
              <Link 
                href="/projects" 
                className={`px-4 py-2.5 rounded-full text-[15px] font-medium transition-all ${
                  isActive('/projects') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-800 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <div className="pt-2 border-t border-gray-200">
                <Button asChild className="w-full rounded-full">
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
