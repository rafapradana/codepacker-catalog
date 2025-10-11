"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, FolderPlus } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

interface CreatePopoverProps {
  children: React.ReactNode
  onPageChange: (page: string) => void
}

export function CreatePopover({ children, onPageChange }: CreatePopoverProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleCreateProject = () => {
    setOpen(false)
    onPageChange("buat project")
    router.push("/app/create/project")
  }

  const handleWriteBlog = () => {
    setOpen(false)
    onPageChange("tulis blog")
    router.push("/app/create/blog")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" side="right" align="start">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 px-2"
            onClick={handleCreateProject}
          >
            <FolderPlus className="mr-2 h-3 w-3" />
            <span className="text-xs">Tambahkan project baru</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 px-2"
            onClick={handleWriteBlog}
          >
            <FileText className="mr-2 h-3 w-3" />
            <span className="text-xs">Tulis Blog</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}