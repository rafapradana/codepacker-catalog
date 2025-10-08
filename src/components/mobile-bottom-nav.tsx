"use client"

import { useRouter, usePathname } from "next/navigation"
import { 
  Home, 
  Search, 
  Plus, 
  LayoutGrid, 
  UserRound,
  HomeIcon,
  SearchIcon,
  LayoutGridIcon,
  UserRoundIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileBottomNavProps {
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
    label: "Cari Profil",
    href: "/app/search",
    icon: Search,
    iconFilled: SearchIcon,
  },
  {
    id: "tambah-project",
    label: "Tambah",
    href: "/app/create",
    icon: Plus,
    iconFilled: Plus,
    isSpecial: true,
  },
  {
    id: "cari-dan-jelajahi-projects",
    label: "Jelajahi",
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

export function MobileBottomNav({ currentPage, onPageChange }: MobileBottomNavProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleMenuClick = (item: typeof mainMenuItems[0]) => {
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
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {mainMenuItems.map((item) => {
          const active = isActive(item.href)
          const IconComponent = active ? item.iconFilled : item.icon

          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-1",
                item.isSpecial
                  ? active
                    ? "bg-white text-black"
                    : "bg-muted text-muted-foreground"
                  : active
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <IconComponent 
                size={20} 
                className={cn(
                  "mb-1",
                  item.isSpecial && active ? "text-black" : "",
                  item.isSpecial && !active ? "text-white" : ""
                )}
              />
              <span className={cn(
                "text-xs font-medium truncate",
                item.isSpecial && active ? "text-black" : "",
                item.isSpecial && !active ? "text-white" : ""
              )}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}