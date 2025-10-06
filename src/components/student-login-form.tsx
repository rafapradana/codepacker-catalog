"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps extends React.ComponentProps<"form"> {}

export function StudentLoginForm({ className, ...props }: LoginFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string[]>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // Clear field-specific errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    // Clear general login error
    if (loginError) {
      setLoginError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setLoginError(null)

    try {
      // Validate form data
      const validationResult = loginSchema.safeParse(formData)
      
      if (!validationResult.success) {
        const fieldErrors: Partial<Record<keyof LoginFormData, string[]>> = {}
        validationResult.error.errors.forEach((error) => {
          const field = error.path[0] as keyof LoginFormData
          if (!fieldErrors[field]) {
            fieldErrors[field] = []
          }
          fieldErrors[field]!.push(error.message)
        })
        setErrors(fieldErrors)
        return
      }

      // Make API call to student login endpoint
      const response = await fetch('/api/auth/student-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        // Redirect to student dashboard
        router.push('/student/dashboard')
      } else {
        setLoginError(result.error || 'Login failed. Please try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Student Login</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Masuk ke akun siswa untuk mengelola profil dan project portfolio Anda
        </p>
      </div>
      
      {loginError && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-3 text-sm">
          {loginError}
        </div>
      )}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username" 
            type="text" 
            placeholder="Masukkan username Anda"
            value={formData.username}
            onChange={handleInputChange("username")}
            className={errors.username ? "border-destructive" : ""}
            disabled={isLoading}
          />
          {errors.username && (
            <div className="text-destructive text-sm">
              {errors.username.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password"
            placeholder="Masukkan password Anda"
            value={formData.password}
            onChange={handleInputChange("password")}
            className={errors.password ? "border-destructive" : ""}
            disabled={isLoading}
          />
          {errors.password && (
            <div className="text-destructive text-sm">
              {errors.password.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Masuk..." : "Masuk"}
        </Button>
      </div>
    </form>
  )
}