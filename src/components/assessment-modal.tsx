"use client"

import { useState, useEffect } from "react"
import { IconX, IconStar, IconStarFilled, IconCheck, IconAlertCircle } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  ProjectForAssessment, 
  AssessmentScores, 
  calculateFinalGrade,
  ASSESSMENT_CRITERIA
} from "@/lib/assessment-types"
import { toast } from "sonner"

interface AssessmentModalProps {
  isOpen: boolean
  onClose: () => void
  project: ProjectForAssessment
  onAssessmentComplete?: () => void
}

export function AssessmentModal({ isOpen, onClose, project, onAssessmentComplete }: AssessmentModalProps) {
  const [scores, setScores] = useState<AssessmentScores>({
    codeQuality: 0,
    functionality: 0,
    uiDesign: 0,
    userExperience: 0,
    responsiveness: 0,
    documentation: 0,
    creativity: 0,
    technologyImplementation: 0,
    performance: 0,
    deployment: 0
  })
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalScore: number = Object.values(scores).reduce((sum: number, score: number) => sum + score, 0)
  const finalGrade: string = calculateFinalGrade(scores)

  // Initialize scores from existing assessment if available, reset when project changes
  useEffect(() => {
    if (project.assessment) {
      setScores({
        codeQuality: project.assessment.codeQuality || 0,
        functionality: project.assessment.functionality || 0,
        uiDesign: project.assessment.uiDesign || 0,
        userExperience: project.assessment.userExperience || 0,
        responsiveness: project.assessment.responsiveness || 0,
        documentation: project.assessment.documentation || 0,
        creativity: project.assessment.creativity || 0,
        technologyImplementation: project.assessment.technologyImplementation || 0,
        performance: project.assessment.performance || 0,
        deployment: project.assessment.deployment || 0
      })
      setNotes(project.assessment.notes || "")
    } else {
      // Reset to default values when no assessment exists or project changes
      setScores({
        codeQuality: 0,
        functionality: 0,
        uiDesign: 0,
        userExperience: 0,
        responsiveness: 0,
        documentation: 0,
        creativity: 0,
        technologyImplementation: 0,
        performance: 0,
        deployment: 0
      })
      setNotes("")
    }
  }, [project.id, project.assessment])

  const handleScoreChange = (criterion: keyof AssessmentScores, score: number) => {
    setScores((prev: AssessmentScores) => ({
      ...prev,
      [criterion]: score
    }))
  }

  const handleSubmit = async () => {
    // Validate all criteria are rated
    const unratedCriteria = Object.keys(ASSESSMENT_CRITERIA).filter(
      key => scores[key as keyof AssessmentScores] === 0
    )
    
    if (unratedCriteria.length > 0) {
      toast.error('Harap berikan penilaian untuk semua kriteria')
      return
    }

    setIsSubmitting(true)
    
    try {
      const assessmentData = {
        projectId: project.id,
        codeQuality: scores.codeQuality,
        functionality: scores.functionality,
        uiDesign: scores.uiDesign,
        userExperience: scores.userExperience,
        responsiveness: scores.responsiveness,
        documentation: scores.documentation,
        creativity: scores.creativity,
        technologyImplementation: scores.technologyImplementation,
        performance: scores.performance,
        deployment: scores.deployment,
        totalScore,
        finalGrade,
        notes,
        status: 'completed' as const
      }

      console.log('Sending assessment data:', assessmentData)

      let result
      if (project.assessment) {
        // Update existing assessment
        const response = await fetch('/api/assessments/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: project.assessment.id, ...assessmentData })
        })
        
        console.log('Update response status:', response.status)
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Update error response:', errorText)
          throw new Error(`Failed to update assessment: ${response.status} ${errorText}`)
        }
        result = await response.json()
      } else {
        // Create new assessment
        const response = await fetch('/api/assessments/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(assessmentData)
        })
        
        console.log('Create response status:', response.status)
        const responseData = await response.json()
        console.log('Create response data:', responseData)
        
        if (!response.ok) {
          console.error('Create error response:', responseData)
          throw new Error(`Failed to create assessment: ${response.status} ${JSON.stringify(responseData)}`)
        }
        result = responseData
      }

      toast.success('Penilaian berhasil disimpan!')
      
      if (onAssessmentComplete) {
        onAssessmentComplete()
      }
      onClose()
    } catch (error) {
      console.error('Error submitting assessment:', error)
      toast.error('Gagal menyimpan penilaian')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStarRating = (criterion: keyof AssessmentScores, currentScore: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleScoreChange(criterion, star)}
            className="transition-colors hover:scale-110"
            disabled={isSubmitting}
          >
            {star <= currentScore ? (
              <IconStarFilled className="h-5 w-5 text-yellow-400" />
            ) : (
              <IconStar className="h-5 w-5 text-gray-300 hover:text-yellow-200" />
            )}
          </button>
        ))}
        <span className="ml-2 text-sm font-medium min-w-[2rem]">
          {currentScore}/10
        </span>
      </div>
    )
  }

  const getGradeBadge = (grade: string) => {
    const gradeColors = {
      'A': 'bg-green-100 text-green-800 border-green-200',
      'B': 'bg-blue-100 text-blue-800 border-blue-200',
      'C': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'D': 'bg-orange-100 text-orange-800 border-orange-200',
      'E': 'bg-red-100 text-red-800 border-red-200',
    }
    
    return (
      <Badge className={gradeColors[grade as keyof typeof gradeColors] || 'bg-gray-100 text-gray-800 border-gray-200'}>
        Grade {grade}
      </Badge>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconStarFilled className="h-5 w-5 text-yellow-500" />
            {project.assessment ? "Edit Penilaian Project" : "Penilaian Project"}
          </DialogTitle>
          <DialogDescription>
            Berikan penilaian untuk project siswa berdasarkan kriteria yang telah ditentukan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-background flex items-center justify-center overflow-hidden">
                {project.thumbnailUrl ? (
                  <img 
                    src={project.thumbnailUrl} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <IconStarFilled className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{project.title}</h3>
                <p className="text-muted-foreground mb-2">
                  {project.description || "Tidak ada deskripsi"}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={project.student.profilePhotoUrl || undefined} />
                      <AvatarFallback className="text-xs">
                        {project.student.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{project.student.fullName}</span>
                  </div>
                  {project.student.class && (
                    <Badge variant="outline">{project.student.class.name}</Badge>
                  )}
                  {project.category && (
                    <Badge variant="outline">{project.category.name}</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Criteria */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Kriteria Penilaian</h4>
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  Total Skor: <span className="font-semibold">{totalScore}/100</span>
                </div>
                {getGradeBadge(finalGrade)}
              </div>
            </div>

            <div className="grid gap-6">
              {Object.entries(ASSESSMENT_CRITERIA).map(([key, criteria]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Label className="text-base font-medium">{criteria.name}</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {criteria.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {renderStarRating(key as keyof AssessmentScores, scores[key as keyof AssessmentScores])}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan Penilaian (Opsional)</Label>
            <Textarea
              id="notes"
              placeholder="Berikan feedback atau catatan tambahan untuk siswa..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          {/* Score Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalScore}</div>
                <div className="text-sm text-muted-foreground">Total Skor</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{finalGrade}</div>
                <div className="text-sm text-muted-foreground">Grade</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round((totalScore / 100) * 100)}%</div>
                <div className="text-sm text-muted-foreground">Persentase</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star}>
                      {star <= Math.round((totalScore / 100) * 5) ? (
                        <IconStarFilled className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <IconStar className="h-5 w-5 text-gray-300" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
          </div>

          {/* Validation Warning */}
          {Object.values(scores).some(score => score === 0) && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <IconAlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Harap berikan nilai untuk semua kriteria penilaian sebelum menyimpan
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || Object.values(scores).some(score => score === 0)}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <IconCheck className="h-4 w-4" />
                  {project.assessment ? "Perbarui Penilaian" : "Simpan Penilaian"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}