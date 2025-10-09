"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import Image from "next/image"
import { Settings, SettingsIcon } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface StudentHeaderProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export function StudentHeader({ currentPage, onPageChange }: StudentHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSettingsClick = () => {
    onPageChange("pengaturan")
    router.push("/app/settings")
  }

  const isSettingsActive = pathname === "/app/settings"

  return (
    <TooltipProvider>
      <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-end h-full px-6">
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

          {/* Theme Toggle Center */}
          <div className="flex items-center">
            <ModeToggle />
          </div>

          {/* Settings Right */}
          <div className="flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleSettingsClick}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200 hover:bg-accent",
                    isSettingsActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  suppressHydrationWarning
                >
                  {isSettingsActive ? (
                    <SettingsIcon size={20} />
                  ) : (
                    <Settings size={20} />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pengaturan</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}