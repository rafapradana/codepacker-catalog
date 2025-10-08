"use client"

import { StudentSidebar } from "@/components/student-app-sidebar"
import { StudentHeader } from "@/components/student-app-header"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { useState } from "react"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentPage, setCurrentPage] = useState("beranda")

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <StudentSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
      
      <div className="flex-1 flex flex-col">
        <StudentHeader currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <div className="block md:hidden">
        <MobileBottomNav currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
    </div>
  )
}