"use client"

import { useState, useEffect, useCallback } from 'react'
import { FeedPost } from '@/components/feed-post'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface FeedProject {
  id: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  githubUrl: string
  liveDemoUrl: string | null
  createdAt: string
  updatedAt: string
  student: {
    id: string
    fullName: string
    profilePhotoUrl: string | null
    classId: string | null
    className: string | null
    userId: string | null
    username: string | null
  }
  category: {
    id: string
    name: string
    bgHex: string
    borderHex: string
    textHex: string
  } | null
  projectTechstacks: Array<{
    projectId: string
    techstack: {
      id: string
      name: string
      iconUrl: string | null
      bgHex: string
      borderHex: string
      textHex: string
    }
  }>
  projectMedia: Array<{
    id: string
    mediaUrl: string
    mediaType: string
  }>
}

export default function AppHomePage() {
  const [projects, setProjects] = useState<FeedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const fetchFeed = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const response = await fetch(`/api/feed?page=${pageNum}&limit=10`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch feed')
      }

      const data = await response.json()
      
      if (append) {
        setProjects(prev => [...prev, ...data.projects])
      } else {
        setProjects(data.projects)
      }
      
      setHasMore(data.hasMore)
      setPage(pageNum)
    } catch (error) {
      console.error('Error fetching feed:', error)
      toast.error('Gagal memuat feed')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchFeed(page + 1, true)
    }
  }, [fetchFeed, page, loadingMore, hasMore])

  const refreshFeed = useCallback(() => {
    fetchFeed(1, false)
  }, [fetchFeed])

  useEffect(() => {
    fetchFeed()
  }, [fetchFeed])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Memuat feed...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Feed Content */}
      <div className="max-w-xl mx-auto px-4">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <h3 className="text-lg font-semibold mb-2">Belum ada project</h3>
              <p className="text-sm">Project terbaru dari siswa akan muncul di sini</p>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {projects.map((project) => (
              <FeedPost key={project.id} project={project} />
            ))}
            
            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-background hover:bg-accent"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Memuat...
                    </>
                  ) : (
                    'Muat lebih banyak'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}