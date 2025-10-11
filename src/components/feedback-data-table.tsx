"use client"

import * as React from "react"
import { IconSearch, IconFilter, IconChevronDown } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface FeedbackData {
  id: string
  feedbackText: string // Changed from 'content' to 'feedbackText' to match API
  status: "belum_ditanggapi" | "sudah_ditanggapi" | "ditolak"
  createdAt: string
  student: {
    id: string
    fullName: string
    username: string // Changed structure to match API response
    profilePhotoUrl?: string
    class?: {
      id: string
      name: string
    }
  }
}

type SortOption = "created-desc" | "created-asc" | "student-asc" | "student-desc"

const statusLabels = {
  belum_ditanggapi: "Belum Ditanggapi",
  sudah_ditanggapi: "Sudah Ditanggapi", 
  ditolak: "Ditolak"
}

const statusColors = {
  belum_ditanggapi: "bg-yellow-100 text-yellow-800 border-yellow-200",
  sudah_ditanggapi: "bg-green-100 text-green-800 border-green-200",
  ditolak: "bg-red-100 text-red-800 border-red-200"
}

export function FeedbackDataTable() {
  const [feedbacks, setFeedbacks] = React.useState<FeedbackData[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [sortBy, setSortBy] = React.useState<SortOption>("created-desc")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const itemsPerPage = 10

  const fetchFeedbacks = React.useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
        sort: sortBy
      })

      const response = await fetch(`/api/feedback?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch feedbacks")
      }

      const data = await response.json()
      setFeedbacks(data.feedback || []) // Use 'feedback' instead of 'feedbacks' and provide fallback
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage))
    } catch (error) {
      console.error("Error fetching feedbacks:", error)
      toast.error("Gagal memuat data feedback")
    } finally {
      setLoading(false)
    }
  }, [currentPage, statusFilter, searchTerm, sortBy])

  React.useEffect(() => {
    fetchFeedbacks()
    
    // Set up polling for realtime updates every 30 seconds
    const pollInterval = setInterval(() => {
      fetchFeedbacks()
    }, 30000)
    
    // Refresh data when window gains focus
    const handleFocus = () => {
      fetchFeedbacks()
    }
    
    window.addEventListener('focus', handleFocus)
    
    // Cleanup
    return () => {
      clearInterval(pollInterval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [fetchFeedbacks])

  const handleStatusUpdate = async (feedbackId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      toast.success("Status feedback berhasil diperbarui")
      fetchFeedbacks() // Refresh data
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Gagal memperbarui status feedback")
    }
  }

  const filteredAndSortedFeedbacks = React.useMemo(() => {
    let filtered = [...feedbacks]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(feedback =>
        feedback.student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.feedbackText.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "created-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "created-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "student-asc":
          return a.student.fullName.localeCompare(b.student.fullName)
        case "student-desc":
          return b.student.fullName.localeCompare(a.student.fullName)
        default:
          return 0
      }
    })

    return filtered
  }, [feedbacks, searchTerm, sortBy])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari siswa atau feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="belum_ditanggapi">Belum Ditanggapi</SelectItem>
              <SelectItem value="sudah_ditanggapi">Sudah Ditanggapi</SelectItem>
              <SelectItem value="ditolak">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Urutkan <IconChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy("created-desc")}>
              Terbaru
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("created-asc")}>
              Terlama
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("student-asc")}>
              Nama Siswa A-Z
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("student-desc")}>
              Nama Siswa Z-A
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Siswa</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : filteredAndSortedFeedbacks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Tidak ada feedback ditemukan
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedFeedbacks.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={feedback.student.profilePhotoUrl} />
                        <AvatarFallback>
                          {feedback.student.fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{feedback.student.fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          @{feedback.student.username}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {feedback.student.class ? (
                      <span className="text-sm">{feedback.student.class.name}</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="truncate" title={feedback.feedbackText}>
                        {feedback.feedbackText}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatDate(feedback.createdAt)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        value={feedback.status}
                        onValueChange={(value) => handleStatusUpdate(feedback.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Belum Ditanggapi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="belum ditanggapi">Belum Ditanggapi</SelectItem>
                          <SelectItem value="sudah ditanggapi">Sudah Ditanggapi</SelectItem>
                          <SelectItem value="ditolak">Ditolak</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}