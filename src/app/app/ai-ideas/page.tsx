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
import { Brain, Lightbulb, Clock, Star, BookmarkIcon, Loader2, AlertCircle, Trash2 } from "lucide-react"
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
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([])
  const [savedIdeas, setSavedIdeas] = useState<ProjectIdea[]>([])
  
  // Form states
  const [skillLevel, setSkillLevel] = useState("")
  const [techStack, setTechStack] = useState("")
  const [timeAvailable, setTimeAvailable] = useState("")
  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState("")

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const session = getStudentSession()
        if (session) {
          setStudentInfo({
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
    if (!studentInfo) {
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
          studentId: studentInfo.id,
          skillLevel,
          techStack: techStack.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0),
          timeAvailable: parseInt(timeAvailable),
          category,
          difficulty
        })
      })

      const data = await response.json()

      if (response.ok) {
        setProjectIdeas(data.ideas || [])
        // Refresh saved ideas to include newly generated ones
        await loadSavedIdeas(studentInfo.id)
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
      } else {
        throw new Error('Failed to delete idea')
      }
    } catch (error) {
      console.error('Error deleting idea:', error)
      setError('Failed to delete idea')
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">AI Project Ideas Generator</h1>
        </div>
        <p className="text-muted-foreground">
          Dapatkan ide project yang dipersonalisasi berdasarkan skill dan preferensi Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Generate Ideas
              </CardTitle>
              <CardDescription>
                Isi form di bawah untuk mendapatkan ide project yang sesuai
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="skillLevel">Skill Level</Label>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pemula">Pemula</SelectItem>
                    <SelectItem value="menengah">Menengah</SelectItem>
                    <SelectItem value="mahir">Mahir</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="techStack">Tech Stack</Label>
                <Input
                  id="techStack"
                  placeholder="e.g., React, Node.js, Python"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="timeAvailable">Waktu Tersedia (jam)</Label>
                <Input
                  id="timeAvailable"
                  type="number"
                  placeholder="e.g., 40"
                  value={timeAvailable}
                  onChange={(e) => setTimeAvailable(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="category">Kategori</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-development">Web Development</SelectItem>
                    <SelectItem value="mobile-development">Mobile Development</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="machine-learning">Machine Learning</SelectItem>
                    <SelectItem value="game-development">Game Development</SelectItem>
                    <SelectItem value="desktop-application">Desktop Application</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="difficulty">Tingkat Kesulitan</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tingkat kesulitan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mudah">Mudah</SelectItem>
                    <SelectItem value="sedang">Sedang</SelectItem>
                    <SelectItem value="sulit">Sulit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={generateIdeas} 
                disabled={isLoading}
                className="w-full"
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
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {/* Generated Ideas */}
          {projectIdeas.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Ideas Baru</h2>
              <div className="grid gap-4">
                {projectIdeas.map((idea) => (
                  <Card key={idea.id} className="relative">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{idea.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{idea.difficulty}</Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {idea.estimatedHours}h
                            </Badge>
                            <Badge variant="outline">{idea.category}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBookmark(idea.id)}
                            className={idea.isBookmarked ? "text-yellow-500" : "text-gray-400"}
                          >
                            <Star className={`h-4 w-4 ${idea.isBookmarked ? "fill-current" : ""}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteIdea(idea.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{idea.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Tech Stack:</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {idea.techStack.map((tech, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Fitur Utama:</Label>
                          <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                            {idea.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Saved Ideas */}
          {savedIdeas.length > 0 && (
            <div>
              <Separator className="my-6" />
              <h2 className="text-2xl font-semibold mb-4">Ideas Tersimpan</h2>
              <div className="grid gap-4">
                {savedIdeas.map((idea) => (
                  <Card key={idea.id} className="relative opacity-75">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{idea.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{idea.difficulty}</Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {idea.estimatedHours}h
                            </Badge>
                            <Badge variant="outline">{idea.category}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBookmark(idea.id)}
                            className={idea.isBookmarked ? "text-yellow-500" : "text-gray-400"}
                          >
                            <Star className={`h-4 w-4 ${idea.isBookmarked ? "fill-current" : ""}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteIdea(idea.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{idea.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Tech Stack:</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {idea.techStack.map((tech, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Fitur Utama:</Label>
                          <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                            {idea.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
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
          {projectIdeas.length === 0 && savedIdeas.length === 0 && !isLoading && (
            <Card className="text-center py-12">
              <CardContent>
                <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Belum Ada Ideas</h3>
                <p className="text-muted-foreground">
                  Isi form di sebelah kiri untuk mulai generate project ideas dengan AI
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}