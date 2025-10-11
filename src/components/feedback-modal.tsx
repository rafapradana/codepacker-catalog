"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageSquare, Send, Heart, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { getStudentSession } from "@/lib/session"

interface FeedbackModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)

  // Reset thank you state when modal opens
  useEffect(() => {
    if (open) {
      setShowThankYou(false)
    }
  }, [open])

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("Mohon masukkan feedback Anda")
      return
    }

    // Get current student session
    const studentSession = getStudentSession()
    if (!studentSession) {
      toast.error("Anda harus login sebagai siswa untuk mengirim feedback")
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackText: feedback.trim(),
          studentId: studentSession.studentId,
        }),
      })

      if (response.ok) {
        setShowThankYou(true)
        setFeedback("")
        // Auto close after 3 seconds
        setTimeout(() => {
          onOpenChange(false)
        }, 3000)
      } else {
        const error = await response.json()
        toast.error(error.message || "Gagal mengirim feedback")
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast.error("Terjadi kesalahan saat mengirim feedback")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting && !showThankYou) {
      setFeedback("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {showThankYou ? (
          // Thank You Screen - Simplified
          <>
            <DialogHeader>
              <DialogTitle className="text-center">
                Feedback Terkirim
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                  <Heart className="h-10 w-10 text-green-600 fill-current" />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-800">
                  Terimakasih atas feedbacknya!
                </p>
              </div>
            </div>
          </>
        ) : (
          // Feedback Form
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Kirim Feedback
              </DialogTitle>
              <DialogDescription>
                Berikan masukan, saran, atau laporkan masalah yang Anda temukan dalam aplikasi ini.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback Anda</Label>
                <Textarea
                  id="feedback"
                  placeholder="Tuliskan feedback, saran, atau masalah yang ingin Anda sampaikan..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[120px] resize-none break-words overflow-hidden"
                  disabled={isSubmitting}
                  maxLength={500}
                />
                <p className="text-sm text-muted-foreground">
                  {feedback.length}/500 karakter
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !feedback.trim()}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Kirim Feedback
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}