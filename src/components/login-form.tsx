"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import Image from "next/image"

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps extends React.ComponentProps<"form"> {
  userType?: "admin" | "student"
}

export function LoginForm({
  className,
  userType = "admin",
  ...props
}: LoginFormProps) {
  const { theme } = useTheme()
  const router = useRouter()
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string[]>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string>("")

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    // Clear login error
    if (loginError) {
      setLoginError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setLoginError("")

    // Validate form data
    const validationResult = loginSchema.safeParse(formData)
    
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format()
      setErrors({
        username: formattedErrors.username?._errors,
        password: formattedErrors.password?._errors,
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validationResult.data),
      })

      const result = await response.json()

      if (result.success) {
        // Redirect to admin dashboard
    if (userType === "admin") {
      router.push('/admin/dashboard')
    } else {
      // Redirect to student app
      router.push('/app')
    }
      } else {
        setLoginError(result.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="mb-4">
          <Image
            src={theme === 'dark' ? '/images/logos/codepacker-white.svg' : '/images/logos/codepacker-black.svg'}
            alt="CodePacker Catalog"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </div>
        <h1 className="text-2xl font-bold">
          {userType === "admin" ? "Login Admin" : "Login Siswa"}
        </h1>
        <p className="text-muted-foreground text-sm text-balance">
          {userType === "admin" 
            ? "Masukkan kredensial Anda untuk mengakses panel admin CodePacker Catalog"
            : "Masukkan kredensial Anda untuk mengakses CodePacker Catalog"
          }
        </p>
      </div>
      
      {loginError && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-3 text-sm">
          {loginError}
        </div>
      )}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Nama Pengguna</Label>
          <Input 
            id="username" 
            type="text" 
            placeholder="Masukkan nama pengguna Anda"
            value={formData.username}
            onChange={handleInputChange("username")}
            className={errors.username ? "border-destructive" : ""}
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
          <Label htmlFor="password">Kata Sandi</Label>
          <Input 
            id="password" 
            type="password"
            placeholder="Masukkan kata sandi Anda"
            value={formData.password}
            onChange={handleInputChange("password")}
            className={errors.password ? "border-destructive" : ""}
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
