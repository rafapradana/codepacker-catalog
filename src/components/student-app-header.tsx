"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { ModeToggle } from "@/components/mode-toggle"

interface StudentHeaderProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export function StudentHeader({ currentPage, onPageChange }: StudentHeaderProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between h-full px-6">
        <div></div> {/* Empty left space */}
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-foreground">Beranda</h1>
        </div>
        <div className="flex items-center">
          <ModeToggle />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between h-full px-4">
        {/* Logo Left */}
        <div className="flex items-center">
          <Image
            src={mounted && theme === "dark" ? "/images/logos/codepacker-white.svg" : "/images/logos/codepacker-black.svg"}
            alt="CodePacker"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </div>

        {/* Title Center */}
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-foreground">Beranda</h1>
        </div>

        {/* Right space for symmetry */}
        <div className="flex items-center">
          <div className="w-6 h-6"></div>
        </div>
      </div>
    </header>
  )
}