"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import Image from "next/image"
import { 
  Home, 
  Search, 
  Plus, 
  LayoutGrid, 
  UserRound, 
  MessageSquare,
  Settings,
  HomeIcon,
  SearchIcon,
  LayoutGridIcon,
  UserRoundIcon,
  MessageSquareIcon,
  SettingsIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FeedbackModal } from "@/components/feedback-modal"

interface StudentSidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

const mainMenuItems = [
  {
    id: "beranda",
    label: "Beranda",
    href: "/app",
    icon: Home,
    iconFilled: HomeIcon,
  },
  {
    id: "cari-profil-siswa",
    label: "Cari Profil Siswa",
    href: "/app/search",
    icon: Search,
    iconFilled: SearchIcon,
  },
  {
    id: "tambah-project",
    label: "Tambah Project",
    href: "/app/create/project",
    icon: Plus,
    iconFilled: Plus,
    isSpecial: true,
  },
  {
    id: "cari-dan-jelajahi-projects",
    label: "Cari dan Jelajahi Projects",
    href: "/app/projects",
    icon: LayoutGrid,
    iconFilled: LayoutGridIcon,
  },
  {
    id: "profil",
    label: "Profil",
    href: "/app/profile",
    icon: UserRound,
    iconFilled: UserRoundIcon,
  },
]

const settingsMenuItems = [
  {
    id: "feedback",
    label: "Feedback",
    href: "/app/feedback",
    icon: MessageSquare,
    iconFilled: MessageSquareIcon,
  },
  {
    id: "pengaturan",
    label: "Pengaturan",
    href: "/app/settings",
    icon: Settings,
    iconFilled: SettingsIcon,
  },
]

export function StudentSidebar({ currentPage, onPageChange }: StudentSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMenuClick = (item: typeof mainMenuItems[0] | typeof settingsMenuItems[0]) => {
    if (item.id === "feedback") {
      setFeedbackModalOpen(true)
      return
    }
    
    onPageChange(item.label.toLowerCase())
    router.push(item.href)
  }

  const isActive = (href: string) => {
    if (href === "/app") {
      return pathname === "/app"
    }
    return pathname.startsWith(href)
  }

  return (
    <TooltipProvider>
      <div className="w-16 bg-background border-r border-border flex flex-col h-full">
        {/* Logo at top */}
        <div className="flex justify-center py-4">
          <Image
            src={mounted && theme === "dark" ? "/images/logos/codepacker-white.svg" : "/images/logos/codepacker-black.svg"}
            alt="CodePacker"
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </div>

        {/* Main menu items centered */}
        <div className="flex-1 flex flex-col justify-center items-center space-y-3">
          {mainMenuItems.map((item) => {
            const active = isActive(item.href)
            const IconComponent = active ? item.iconFilled : item.icon

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={cn(
                      "p-2 rounded-lg transition-all duration-200 hover:bg-accent",
                      item.isSpecial
                        ? active
                          ? "bg-white text-black"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                        : active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    suppressHydrationWarning
                  >
                    <IconComponent 
                      size={20} 
                      className={cn(
                        item.isSpecial && active ? "text-black" : "",
                        item.isSpecial && !active ? "text-white" : ""
                      )}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        {/* Settings at bottom */}
        <div className="flex flex-col justify-center items-center space-y-3 pb-4">
          {settingsMenuItems.map((item) => {
            const active = item.id !== "feedback" && isActive(item.href)
            const IconComponent = active ? item.iconFilled : item.icon

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={cn(
                      "p-2 rounded-lg transition-all duration-200 hover:bg-accent",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <IconComponent size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal 
        open={feedbackModalOpen} 
        onOpenChange={setFeedbackModalOpen} 
      />
    </TooltipProvider>
  )
}