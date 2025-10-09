'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isStudentLoggedIn } from '@/lib/session'

export function RedirectHandler() {
  const router = useRouter()

  useEffect(() => {
    // Check if student is logged in
    if (isStudentLoggedIn()) {
      // Redirect to student app
      router.push('/app')
    }
  }, [router])

  // This component doesn't render anything
  return null
}