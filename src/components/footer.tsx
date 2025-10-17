"use client";

import Link from "next/link";
import { Github, Instagram, Mail } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which logo to use based on theme
  const logoSrc = mounted && (resolvedTheme === 'dark' || theme === 'dark') 
    ? "/images/logos/codepacker-white.svg" 
    : "/images/logos/codepacker-black.svg";

  return (
    <footer className={`bg-background border-t border-border ${className}`}>
      <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              {mounted && (
                <Image
                  src={logoSrc}
                  alt="Codepacker Catalog Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                  priority
                  quality={100}
                />
              )}
              <span className="text-xl font-bold font-poppins text-foreground">Codepacker Catalog</span>
            </div>
            <p className="text-muted-foreground text-sm font-inter leading-relaxed mb-4">
              Platform modern untuk menampilkan katalog dan portofolio siswa RPL SMKN 4 Malang.
            </p>
            {/* JHIC Logo */}
            <div className="flex items-center space-x-3 mt-2">
              <span className="text-sm text-muted-foreground">Penyelenggara:</span>
              <Image
                src="/images/jhic-logo.png"
                alt="JHIC Logo"
                width={160}
                height={80}
                className="h-12 w-auto object-contain"
                quality={100}
                priority
              />
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="font-semibold mb-4 text-base font-poppins text-foreground">Navigasi</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm font-inter">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/siswa" className="text-muted-foreground hover:text-primary transition-colors text-sm font-inter">
                  Siswa
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors text-sm font-inter">
                  Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Kategori */}
          <div>
            <h3 className="font-semibold mb-4 text-base font-poppins text-foreground">Kategori</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/projects?category=web" className="text-muted-foreground hover:text-primary transition-colors text-sm font-inter">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/projects?category=mobile" className="text-muted-foreground hover:text-primary transition-colors text-sm font-inter">
                  Mobile Development
                </Link>
              </li>
              <li>
                <Link href="/projects?category=game" className="text-muted-foreground hover:text-primary transition-colors text-sm font-inter">
                  Game Development
                </Link>
              </li>
              <li>
                <Link href="/projects?category=desktop" className="text-muted-foreground hover:text-primary transition-colors text-sm font-inter">
                  Desktop Application
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak & Social Media */}
          <div>
            <h3 className="font-semibold mb-4 text-base font-poppins text-foreground">Kontak & Social Media</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <Link 
                  href="mailto:info@smkn4malang.sch.id"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm font-inter"
                >
                  info@smkn4malang.sch.id
                </Link>
              </div>
              <div className="flex items-center space-x-3 mt-4">
                <Link 
                  href="https://github.com/codepackerid" 
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="w-5 h-5" />
                </Link>
                <Link 
                  href="https://instagram.com/codepacker.catalog" 
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm font-inter">
            © 2025 SMKN 4 Malang. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm font-inter mt-2 md:mt-0">
            Made with <span className="text-red-500">❤️</span> by Sahabat Azril
          </p>
        </div>
      </div>
    </footer>
  );
}
