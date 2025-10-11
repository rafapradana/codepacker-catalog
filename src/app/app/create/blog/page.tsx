import { Construction } from "lucide-react"

export default function CreateBlogPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Construction className="h-16 w-16 text-muted-foreground" />
      <h1 className="text-2xl font-semibold text-center">Under Development</h1>
      <p className="text-muted-foreground text-center max-w-md">
        Halaman untuk membuat blog sedang dalam pengembangan. Fitur ini akan segera tersedia.
      </p>
    </div>
  )
}