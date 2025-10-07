import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { IconBrandGithub, IconBrandLinkedin, IconUser } from "@tabler/icons-react"
import Link from "next/link"

interface StudentCardProps {
  student: {
    id: string
    fullName: string
    bio?: string | null
    profilePhotoUrl?: string | null
    githubUrl?: string | null
    linkedinUrl?: string | null
    user?: {
      id: string
      username: string
      email: string
      role: string
    } | null
    class?: {
      id: string
      name: string
    } | null
    skills: {
      id: string
      name: string
      iconUrl: string | null
      bgHex: string
      borderHex: string
      textHex: string
    }[]
  }
}

export function StudentCard({ student }: StudentCardProps) {
  const displayedSkills = student.skills.slice(0, 4)

  return (
    <Card className="group relative overflow-hidden bg-card border border-border hover:shadow-lg transition-all duration-300 ease-out">
      {/* Header - Centered Profile Photo */}
      <CardHeader className="pb-4 text-center">
        <div className="flex flex-col items-center space-y-3">
          {/* Profile Photo - Center */}
          <Avatar className="h-20 w-20 ring-2 ring-border">
            <AvatarImage src={student.profilePhotoUrl || ""} />
            <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-xl">
              {student.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          {/* Full Name - Center */}
          <h3 className="font-semibold text-lg leading-tight text-card-foreground">
            {student.fullName}
          </h3>
          
          {/* Username • Class - Center */}
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            {student.user?.username && (
              <>
                <span>@{student.user.username}</span>
                {student.class && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{student.class.name}</span>
                  </>
                )}
              </>
            )}
            {!student.user?.username && student.class && (
              <span>{student.class.name}</span>
            )}
          </div>
          
          {/* Social Links - Center */}
          {(student.githubUrl || student.linkedinUrl) && (
            <div className="flex gap-2 justify-center">
              {student.githubUrl && (
                <Link 
                  href={student.githubUrl} 
                  target="_blank" 
                  className="p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors group/social"
                >
                  <IconBrandGithub className="h-4 w-4 text-muted-foreground group-hover/social:text-card-foreground transition-colors" />
                </Link>
              )}
              {student.linkedinUrl && (
                <Link 
                  href={student.linkedinUrl} 
                  target="_blank" 
                  className="p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors group/social"
                >
                  <IconBrandLinkedin className="h-4 w-4 text-muted-foreground group-hover/social:text-card-foreground transition-colors" />
                </Link>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="px-6 pb-4 space-y-4">
        {/* Bio - Left Align */}
        {student.bio && (
          <div>
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed text-left">
              {student.bio}
            </p>
          </div>
        )}

        {/* Skills - Left Align */}
        {student.skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-card-foreground text-left">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {displayedSkills.map((skill) => (
                <Badge
                  key={skill.id}
                  className="text-xs px-2 py-1 font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: skill.bgHex,
                    borderColor: skill.borderHex,
                    color: skill.textHex,
                  }}
                >
                  {skill.name}
                </Badge>
              ))}
              {student.skills.length > 4 && (
                <Badge variant="outline" className="text-xs px-2 py-1 text-muted-foreground border-dashed">
                  +{student.skills.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer - Full Width Button */}
      <CardFooter className="px-6 pt-0 pb-6">
        <Button 
          asChild 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200"
        >
          <Link href={`/siswa/${student.id}`}>
            Lihat Profil
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}