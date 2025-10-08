import { StudentLoginForm } from "@/components/student-login-form"
import { ModeToggle } from "@/components/mode-toggle"

export default function StudentLoginPage() {
  return (
    <div className="min-h-svh flex flex-col">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <StudentLoginForm />
        </div>
      </div>
    </div>
  )
}