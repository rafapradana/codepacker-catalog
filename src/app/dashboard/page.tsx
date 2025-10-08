"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  BookOpen, 
  Code, 
  Github, 
  Globe, 
  LogOut, 
  Plus, 
  Star,
  TrendingUp,
  Users
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
}

interface Project {
  id: string
  title: string
  description: string
  techStack: string[]
  category: string
  githubUrl: string
  liveDemoUrl?: string
  thumbnailUrl?: string
  createdAt: string
}

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  // Mock data for testing
  const mockProjects: Project[] = [
    {
      id: "1",
      title: "E-Commerce Website",
      description: "Full-stack e-commerce platform dengan React dan Node.js",
      techStack: ["React", "Node.js", "MongoDB", "Express"],
      category: "Web Development",
      githubUrl: "https://github.com/student/ecommerce",
      liveDemoUrl: "https://ecommerce-demo.vercel.app",
      createdAt: "2024-01-15"
    },
    {
      id: "2", 
      title: "Mobile Todo App",
      description: "Aplikasi todo list dengan React Native dan Firebase",
      techStack: ["React Native", "Firebase", "TypeScript"],
      category: "Mobile Development",
      githubUrl: "https://github.com/student/todo-app",
      createdAt: "2024-01-10"
    },
    {
      id: "3",
      title: "Data Visualization Dashboard",
      description: "Dashboard analitik data dengan D3.js dan Python",
      techStack: ["Python", "D3.js", "Flask", "PostgreSQL"],
      category: "Data Science",
      githubUrl: "https://github.com/student/data-viz",
      liveDemoUrl: "https://data-viz-demo.herokuapp.com",
      createdAt: "2024-01-05"
    }
  ]

  const stats = {
    totalProjects: mockProjects.length,
    totalViews: 1250,
    githubStars: 45,
    completedProjects: 8
  }

  useEffect(() => {
    // Check if user is logged in
    const studentData = localStorage.getItem("student")
    if (studentData) {
      setUser(JSON.parse(studentData))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("student")
    router.push("/login")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <BookOpen className="size-4" />
            </div>
            <span className="text-lg font-semibold">CodePacker Catalog</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user?.name || 'User'}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Selamat Datang, {user.name}!</h1>
          <p className="text-muted-foreground">
            Kelola portfolio dan project coding kamu di sini
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                +2 dari bulan lalu
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
              <p className="text-xs text-muted-foreground">
                +15% dari minggu lalu
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">GitHub Stars</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.githubStars}</div>
              <p className="text-xs text-muted-foreground">
                +5 stars baru
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedProjects}</div>
              <p className="text-xs text-muted-foreground">
                Projects selesai
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Projects Terbaru</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Project
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <Badge variant="secondary">{project.category}</Badge>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-1" />
                          GitHub
                        </a>
                      </Button>
                      {project.liveDemoUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4 mr-1" />
                            Demo
                          </a>
                        </Button>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Dibuat: {new Date(project.createdAt).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}