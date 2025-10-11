'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { StudentSidebar } from '@/components/student-app-sidebar'
import { StudentHeader } from '@/components/student-app-header'
import { MobileBottomNav } from '@/components/mobile-bottom-nav'
import { getStudentSession } from '@/lib/session'
import { onlineStatusManager } from '@/lib/online-status'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [currentPage, setCurrentPage] = useState(pathname)

  const handlePageChange = (page: string) => {
    setCurrentPage(page)
  }

  // Initialize online status for logged-in user
  useEffect(() => {
    const initializeOnlineStatus = async () => {
      try {
        const session = getStudentSession()
        if (session?.id) {
          await onlineStatusManager.initializeUser(session.id)
        }
      } catch (error) {
        console.error('Failed to initialize online status:', error)
      }
    }

    initializeOnlineStatus()

    // Cleanup on unmount
    return () => {
      onlineStatusManager.stopHeartbeat()
    }
  }, [])

  return (
    <div className="h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <StudentSidebar currentPage={currentPage} onPageChange={handlePageChange} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <StudentHeader currentPage={currentPage} onPageChange={handlePageChange} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        
        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden">
          <MobileBottomNav currentPage={currentPage} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  )
}