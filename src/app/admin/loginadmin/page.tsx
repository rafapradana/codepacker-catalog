import { LoginForm } from "@/components/login-form"
import { ModeToggle } from "@/components/mode-toggle"

export default function LoginPage() {
  return (
    <div className="min-h-svh flex flex-col">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
