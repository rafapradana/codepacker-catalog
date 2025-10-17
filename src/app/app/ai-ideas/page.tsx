"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Lightbulb, Clock, Star, BookmarkIcon, Loader2, AlertCircle, Trash2, Plus, Brain, Eye } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getStudentSession } from "@/lib/session"

interface ProjectIdea {
  id: string
  title: string
  description: string
  techStack: string[]
  difficulty: string
  estimatedHours: number
  category: string
  features: string[]
  isBookmarked: boolean
  createdAt: string
}

interface StudentInfo {
  id: string
  name: string
  email: string
}

export default function AIProjectIdeasPage() {
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([])
  const [savedIdeas, setSavedIdeas] = useState<ProjectIdea[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [student, setStudent] = useState<StudentInfo | null>(null)
  
  // Form states
  const [skillLevel, setSkillLevel] = useState("")
  const [techStack, setTechStack] = useState("")
  const [timeAvailable, setTimeAvailable] = useState("")
  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState("")
  
  // Modal states
  const [isInputModalOpen, setIsInputModalOpen] = useState(false)
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedDetailIdea, setSelectedDetailIdea] = useState<ProjectIdea | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [ideaToDelete, setIdeaToDelete] = useState<ProjectIdea | null>(null)
  const [generatedIdeas, setGeneratedIdeas] = useState<ProjectIdea[]>([])
  const [selectedIdeasToSave, setSelectedIdeasToSave] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const session = getStudentSession()
        if (session) {
          setStudent({
            id: session.studentId,
            name: session.name,
            email: session.email
          })
          await loadSavedIdeas(session.studentId)
        }
      } catch (error) {
        console.error('Error loading student data:', error)
      }
    }

    loadStudentData()
  }, [])

  const loadSavedIdeas = async (studentId: string) => {
    try {
      const response = await fetch(`/api/ai/generate-ideas?studentId=${studentId}`)
      if (response.ok) {
        const data = await response.json()
        setSavedIdeas(data.ideas || [])
      }
    } catch (error) {
      console.error('Error loading saved ideas:', error)
    }
  }

  const generateIdeas = async () => {
    if (!student) {
      setError('Student information not available')
      return
    }

    if (!skillLevel || !techStack || !timeAvailable || !category || !difficulty) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/generate-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: student.id,
          skillLevel,
          techStack: techStack.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0),
          timeAvailable: parseInt(timeAvailable),
          category,
          difficulty
        })
      })

      const data = await response.json()

      if (response.ok) {
        setGeneratedIdeas(data.ideas || [])
        setIsInputModalOpen(false)
        setIsResultsModalOpen(true)
      } else {
        setError(data.error || 'Failed to generate ideas')
      }
    } catch (error) {
      console.error('Error generating ideas:', error)
      setError('An error occurred while generating ideas')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleBookmark = async (ideaId: string) => {
    const currentIdea = projectIdeas.find(idea => idea.id === ideaId) || 
                      savedIdeas.find(idea => idea.id === ideaId)
    if (!currentIdea) return
    
    try {
      const response = await fetch(`/api/ai/generate-ideas/${ideaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isBookmarked: !currentIdea.isBookmarked
        })
      })

      if (response.ok) {
        // Update the idea in both generated and saved ideas
        const updateIdea = (idea: ProjectIdea) => 
          idea.id === ideaId ? { ...idea, isBookmarked: !currentIdea.isBookmarked } : idea

        setProjectIdeas(prev => prev.map(updateIdea))
        setSavedIdeas(prev => prev.map(updateIdea))
      } else {
        throw new Error('Failed to update bookmark')
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      setError('Failed to update bookmark')
    }
  }

  // Function to show delete confirmation
  const showDeleteConfirmation = (idea: ProjectIdea) => {
    setIdeaToDelete(idea)
    setIsDeleteModalOpen(true)
  }

  // Function to delete an idea
  const deleteIdea = async (ideaId: string) => {
    try {
      const response = await fetch(`/api/ai/generate-ideas/${ideaId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Remove the idea from both generated and saved ideas
        setProjectIdeas(prev => prev.filter(idea => idea.id !== ideaId))
        setSavedIdeas(prev => prev.filter(idea => idea.id !== ideaId))
        setIsDeleteModalOpen(false)
        setIdeaToDelete(null)
      } else {
        throw new Error('Failed to delete idea')
      }
    } catch (error) {
      console.error('Error deleting idea:', error)
      setError('Failed to delete idea')
    }
  }

  // Function to handle saving selected ideas
  const saveSelectedIdeas = async () => {
    const ideasToSave = generatedIdeas.filter(idea => selectedIdeasToSave.has(idea.id))
    
    try {
      // Add the selected ideas to saved ideas
      setSavedIdeas(prev => [...prev, ...ideasToSave])
      
      // Close the results modal and reset states
      setIsResultsModalOpen(false)
      setGeneratedIdeas([])
      setSelectedIdeasToSave(new Set())
      
      // Reset form
      setSkillLevel("")
      setTechStack("")
      setTimeAvailable("")
      setCategory("")
      setDifficulty("")
    } catch (error) {
      console.error('Error saving ideas:', error)
      setError('Failed to save ideas')
    }
  }

  // Function to toggle idea selection for saving
  const toggleIdeaSelection = (ideaId: string) => {
    setSelectedIdeasToSave(prev => {
      const newSet = new Set(prev)
      if (newSet.has(ideaId)) {
        newSet.delete(ideaId)
      } else {
        newSet.add(ideaId)
      }
      return newSet
    })
  }

  // Function to view idea details
  const viewIdeaDetails = (idea: ProjectIdea) => {
    setSelectedDetailIdea(idea)
    setIsDetailModalOpen(true)
  }

  // Sort saved ideas with bookmarked ones first
  const sortedSavedIdeas = [...savedIdeas].sort((a, b) => {
    if (a.isBookmarked && !b.isBookmarked) return -1
    if (!a.isBookmarked && b.isBookmarked) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-8">
        {/* Title and Description - Top Left */}
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Project Ideas Generator</h1>
          <p className="text-muted-foreground">
            Dapatkan ide project yang dipersonalisasi berdasarkan skill dan preferensi Anda
          </p>
        </div>

        {/* Generate Button - Top Right */}
        <Dialog open={isInputModalOpen} onOpenChange={setIsInputModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Generate New Project Ideas
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader className="space-y-3 flex-shrink-0">
              <DialogTitle className="text-xl font-semibold">Generate Project Ideas</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Isi form di bawah untuk mendapatkan ide project yang sesuai dengan kebutuhan Anda
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto px-1">
              <div className="space-y-6 py-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="skillLevel" className="text-sm font-medium">Skill Level</Label>
                    <Select value={skillLevel} onValueChange={setSkillLevel}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Pilih skill level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pemula">Pemula</SelectItem>
                        <SelectItem value="menengah">Menengah</SelectItem>
                        <SelectItem value="mahir">Mahir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeAvailable" className="text-sm font-medium">Waktu Tersedia</Label>
                    <div className="relative">
                      <Input
                        id="timeAvailable"
                        type="number"
                        value={timeAvailable}
                        onChange={(e) => setTimeAvailable(e.target.value)}
                        placeholder="40"
                        className="h-10 pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">jam</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="techStack" className="text-sm font-medium">Tech Stack</Label>
                  <Input
                    id="techStack"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    placeholder="React, Node.js, MongoDB, Python, etc."
                    className="h-10"
                  />
                  <p className="text-xs text-muted-foreground">Pisahkan dengan koma untuk multiple tech stack</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">Kategori Project</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web">Web Development</SelectItem>
                        <SelectItem value="mobile">Mobile App</SelectItem>
                        <SelectItem value="desktop">Desktop App</SelectItem>
                        <SelectItem value="game">Game Development</SelectItem>
                        <SelectItem value="ai">AI/Machine Learning</SelectItem>
                        <SelectItem value="cli">CLI Tool</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty" className="text-sm font-medium">Tingkat Kesulitan</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Pilih tingkat kesulitan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mudah">Mudah</SelectItem>
                        <SelectItem value="sedang">Sedang</SelectItem>
                        <SelectItem value="sulit">Sulit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t flex-shrink-0">
              <Button variant="outline" onClick={() => setIsInputModalOpen(false)} className="flex-1">
                Batal
              </Button>
              <Button 
                onClick={generateIdeas} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Generate Ideas
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Detail Project Idea</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang project idea ini
            </DialogDescription>
          </DialogHeader>
          
          {selectedDetailIdea && (
            <div className="py-4 space-y-6">
              {/* Title and Basic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedDetailIdea.title}</h3>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="secondary">{selectedDetailIdea.difficulty}</Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedDetailIdea.estimatedHours} jam
                  </Badge>
                  <Badge variant="outline">{selectedDetailIdea.category}</Badge>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-sm font-semibold">Deskripsi Project</Label>
                <p className="text-muted-foreground mt-2 leading-relaxed">{selectedDetailIdea.description}</p>
              </div>

              {/* Tech Stack */}
              <div>
                <Label className="text-sm font-semibold">Tech Stack</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedDetailIdea.techStack.map((tech, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <Label className="text-sm font-semibold">Fitur Utama</Label>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  {selectedDetailIdea.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm font-semibold">Estimasi Waktu</Label>
                  <p className="text-muted-foreground mt-1">{selectedDetailIdea.estimatedHours} jam</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Tingkat Kesulitan</Label>
                  <p className="text-muted-foreground mt-1 capitalize">{selectedDetailIdea.difficulty}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Results Modal */}
       <Dialog open={isResultsModalOpen} onOpenChange={setIsResultsModalOpen}>
         <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
           <DialogHeader>
             <DialogTitle>Generated Project Ideas</DialogTitle>
             <DialogDescription>
               Pilih project ideas yang ingin Anda simpan
             </DialogDescription>
           </DialogHeader>
           
           <div className="py-4">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {generatedIdeas.map((idea) => (
                <Card 
                   key={idea.id} 
                   className={`cursor-pointer transition-all h-full ${
                     selectedIdeasToSave.has(idea.id) 
                       ? 'ring-2 ring-blue-500 bg-blue-50' 
                       : 'hover:shadow-md'
                   }`}
                   onClick={() => toggleIdeaSelection(idea.id)}
                 >
                   <CardHeader className="pb-3">
                     <div className="flex items-start justify-between gap-3">
                       <div className="flex-1 min-w-0">
                         <CardTitle className="text-base lg:text-lg leading-tight line-clamp-2">{idea.title}</CardTitle>
                         <div className="flex flex-wrap items-center gap-1 mt-2">
                           <Badge variant="secondary" className="text-xs">{idea.difficulty}</Badge>
                           <Badge variant="outline" className="flex items-center gap-1 text-xs">
                             <Clock className="h-3 w-3" />
                             {idea.estimatedHours}h
                           </Badge>
                           <Badge variant="outline" className="text-xs">{idea.category}</Badge>
                         </div>
                       </div>
                       <div className="flex items-center flex-shrink-0">
                         <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                           selectedIdeasToSave.has(idea.id)
                             ? 'bg-blue-500 border-blue-500'
                             : 'border-gray-300'
                         }`}>
                           {selectedIdeasToSave.has(idea.id) && (
                             <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                               <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                             </svg>
                           )}
                         </div>
                       </div>
                     </div>
                   </CardHeader>
                   <CardContent className="pt-0">
                     <p className="text-muted-foreground text-sm mb-3 line-clamp-3">{idea.description}</p>
                     
                     <div className="space-y-2">
                       <div>
                         <Label className="text-xs font-medium">Tech Stack:</Label>
                         <div className="flex flex-wrap gap-1 mt-1">
                           {idea.techStack.slice(0, 4).map((tech, index) => (
                             <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                               {tech}
                             </Badge>
                           ))}
                           {idea.techStack.length > 4 && (
                             <Badge variant="outline" className="text-xs px-2 py-0.5">
                               +{idea.techStack.length - 4}
                             </Badge>
                           )}
                         </div>
                       </div>
                       
                       <div>
                         <Label className="text-xs font-medium">Fitur Utama:</Label>
                         <ul className="list-disc list-inside text-xs text-muted-foreground mt-1 space-y-0.5">
                           {idea.features.slice(0, 2).map((feature, index) => (
                             <li key={index} className="line-clamp-1">{feature}</li>
                           ))}
                           {idea.features.length > 2 && (
                             <li className="text-blue-600">+{idea.features.length - 2} fitur lainnya</li>
                           )}
                         </ul>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
              ))}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsResultsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={saveSelectedIdeas}
                disabled={selectedIdeasToSave.size === 0}
              >
                Save Selected Ideas ({selectedIdeasToSave.size})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Saved Ideas Grid - 4 cards per row */}
       {sortedSavedIdeas.length > 0 && (
         <div>
           <h2 className="text-2xl font-semibold mb-6">Saved Project Ideas</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
             {sortedSavedIdeas.map((idea) => (
               <Card key={idea.id} className="relative h-full flex flex-col">
                 <CardHeader className="pb-3">
                   <div className="flex items-start justify-between gap-2">
                     <div className="flex-1 min-w-0">
                       <CardTitle className="text-base lg:text-lg leading-tight line-clamp-2">{idea.title}</CardTitle>
                       <div className="flex flex-wrap items-center gap-1 mt-2">
                         <Badge variant="secondary" className="text-xs">{idea.difficulty}</Badge>
                         <Badge variant="outline" className="flex items-center gap-1 text-xs">
                           <Clock className="h-3 w-3" />
                           {idea.estimatedHours}h
                         </Badge>
                         <Badge variant="outline" className="text-xs">{idea.category}</Badge>
                       </div>
                     </div>
                     <div className="flex gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewIdeaDetails(idea)}
                          className="text-blue-500 hover:text-blue-700 h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(idea.id)}
                          className={`h-8 w-8 p-0 ${idea.isBookmarked ? "text-yellow-500" : "text-gray-400"}`}
                        >
                          <Star className={`h-4 w-4 ${idea.isBookmarked ? "fill-current" : ""}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => showDeleteConfirmation(idea)}
                          className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                   </div>
                 </CardHeader>
                 <CardContent className="pt-0 flex-1 flex flex-col">
                   <p className="text-muted-foreground text-sm mb-3 line-clamp-3 flex-1">{idea.description}</p>
                   
                   <div className="space-y-2 mt-auto">
                     <div>
                       <Label className="text-xs font-medium">Tech Stack:</Label>
                       <div className="flex flex-wrap gap-1 mt-1">
                         {idea.techStack.slice(0, 3).map((tech, index) => (
                           <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                             {tech}
                           </Badge>
                         ))}
                         {idea.techStack.length > 3 && (
                           <Badge variant="outline" className="text-xs px-2 py-0.5">
                             +{idea.techStack.length - 3}
                           </Badge>
                         )}
                       </div>
                     </div>
                     
                     <div>
                       <Label className="text-xs font-medium">Fitur Utama:</Label>
                       <ul className="list-disc list-inside text-xs text-muted-foreground mt-1 space-y-0.5">
                         {idea.features.slice(0, 2).map((feature, index) => (
                           <li key={index} className="line-clamp-1">{feature}</li>
                         ))}
                         {idea.features.length > 2 && (
                           <li className="text-blue-600">+{idea.features.length - 2} fitur lainnya</li>
                         )}
                       </ul>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             ))}
           </div>
         </div>
       )}

      {/* Empty State */}
      {sortedSavedIdeas.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum Ada Project Ideas</h3>
            <p className="text-muted-foreground">
              Klik tombol "Generate New Project Ideas" di atas untuk mulai membuat ide project dengan AI
            </p>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Konfirmasi Hapus
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus project idea ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          
          {ideaToDelete && (
            <div className="py-4">
              <div className="bg-muted p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">{ideaToDelete.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {ideaToDelete.description}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false)
                setIdeaToDelete(null)
              }}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => ideaToDelete && deleteIdea(ideaToDelete.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}