"use client"

import { StudentSidebar } from "@/components/student-app-sidebar"
import { StudentHeader } from "@/components/student-app-header"
import { useState } from "react"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentPage, setCurrentPage] = useState("beranda")

  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 flex flex-col">
        <StudentHeader currentPage={currentPage} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}