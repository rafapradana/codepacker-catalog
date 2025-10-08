"use client"

import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"

interface StudentHeaderProps {
  currentPage: string
}

const getPageTitle = (pathname: string): string => {
  if (pathname === "/app") return "Beranda"
  if (pathname === "/app/search") return "Cari Profil Siswa"
  if (pathname === "/app/create") return "Tambah Project"
  if (pathname === "/app/projects") return "Cari dan Jelajahi Projects"
  if (pathname === "/app/profile") return "Profil"
  if (pathname === "/app/settings") return "Pengaturan"
  return "CodePacker"
}

export function StudentHeader({ currentPage }: StudentHeaderProps) {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex-1 flex justify-center">
          <h1 className="text-lg font-semibold">{pageTitle}</h1>
        </div>
        <div className="flex items-center">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}