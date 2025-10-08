"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface StudentLoginFormProps extends React.ComponentPropsWithoutRef<"form"> {}

export function StudentLoginForm({ className, ...props }: StudentLoginFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [errors, setErrors] = useState<{
    email?: string[]
    password?: string[]
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const router = useRouter()
  const { theme } = useTheme()

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const validateForm = () => {
    const newErrors: typeof errors = {}
    
    if (!formData.email) {
      newErrors.email = ["Email wajib diisi"]
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = ["Format email tidak valid"]
    }
    
    if (!formData.password) {
      newErrors.password = ["Password wajib diisi"]
    } else if (formData.password.length < 6) {
      newErrors.password = ["Password minimal 6 karakter"]
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/student-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("student", JSON.stringify(data.user))
        router.push("/dashboard")
      } else {
        const errorData = await response.json()
        setLoginError(errorData.error || "Login gagal. Periksa email dan password Anda.")
      }
    } catch (error) {
      setLoginError("Terjadi kesalahan. Silakan coba lagi.")
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
        <h1 className="text-2xl font-bold">Login Siswa</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Masukkan kredensial Anda untuk mengakses dashboard siswa CodePacker Catalog
        </p>
      </div>
      
      {loginError && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-3 text-sm">
          {loginError}
        </div>
      )}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Masukkan email Anda"
            value={formData.email}
            onChange={handleInputChange("email")}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <div className="text-destructive text-sm">
              {errors.email.map((error, index) => (
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