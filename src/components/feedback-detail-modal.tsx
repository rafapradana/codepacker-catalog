"use client"

import * as React from "react"
import { IconX, IconUser, IconCalendar, IconMessage } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import Link from "next/link"

interface FeedbackDetailModalProps {
  feedback: {
    id: string
    feedbackText: string
    status: "belum_ditanggapi" | "sudah_ditanggapi" | "ditolak"
    createdAt: string
    student: {
      id: string
      fullName: string
      username: string
      profilePhotoUrl?: string
      class?: {
        id: string
        name: string
      }
    }
  } | null
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: (feedbackId: string, newStatus: string) => void
}

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

export function FeedbackDetailModal({ 
  feedback, 
  isOpen, 
  onClose, 
  onStatusUpdate 
}: FeedbackDetailModalProps) {
  const [isUpdating, setIsUpdating] = React.useState(false)

  if (!feedback) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  }

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      await onStatusUpdate(feedback.id, newStatus)
      toast.success("Status feedback berhasil diperbarui")
    } catch (error) {
      toast.error("Gagal memperbarui status feedback")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconMessage className="h-5 w-5" />
            Detail Feedback
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <IconUser className="h-5 w-5" />
                Profil Siswa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={feedback.student.profilePhotoUrl} />
                  <AvatarFallback className="text-lg">
                    {feedback.student.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="text-xl font-semibold">{feedback.student.fullName}</h3>
                    <p className="text-muted-foreground">@{feedback.student.username}</p>
                  </div>
                  {feedback.student.class && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-sm">
                        {feedback.student.class.name}
                      </Badge>
                    </div>
                  )}
                  <div className="pt-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/kelola-siswa/${feedback.student.id}`}>
                        Lihat Detail Profil
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <IconCalendar className="h-5 w-5" />
                Detail Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Waktu Pengiriman
                </label>
                <p className="text-sm mt-1">{formatDate(feedback.createdAt)}</p>
              </div>
              
              <Separator />
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Pesan Feedback
                </label>
                <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {feedback.feedbackText}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Management Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Feedback</CardTitle>
              <CardDescription>
                Ubah status tanggapan untuk feedback ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Status Saat Ini
                  </label>
                  <div className="mt-2">
                    <Badge 
                      variant="outline" 
                      className={`${statusColors[feedback.status]} border`}
                    >
                      {statusLabels[feedback.status]}
                    </Badge>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Ubah Status
                  </label>
                  <Select
                    value={feedback.status}
                    onValueChange={handleStatusChange}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="belum ditanggapi">Belum Ditanggapi</SelectItem>
                      <SelectItem value="sudah ditanggapi">Sudah Ditanggapi</SelectItem>
                      <SelectItem value="ditolak">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Tutup Modal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}