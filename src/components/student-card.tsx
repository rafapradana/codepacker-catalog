import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { IconBrandGithub, IconBrandLinkedin, IconUser } from "@tabler/icons-react"
import { ProfileWithOnlineStatus } from "@/components/ui/online-status-dot"
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
  isStudentApp?: boolean // New prop to determine routing context
}

export function StudentCard({ student, isStudentApp = false }: StudentCardProps) {
  const displayedSkills = student.skills.slice(0, 4)

  // Determine the profile URL based on context
  const profileUrl = isStudentApp 
    ? `/app/${student.user?.username || student.id}` 
    : `/${student.user?.username || student.id}`

  return (
    <Card className="group relative overflow-hidden bg-card border border-border hover:shadow-lg transition-all duration-300 ease-out">
      {/* Header - Centered Profile Photo */}
      <CardHeader className="pb-3 text-center">
        <div className="flex flex-col items-center space-y-2">
          {/* Profile Photo with Online Status - Center */}
          <ProfileWithOnlineStatus 
            userId={student.user?.id || student.id}
            dotSize="sm"
            dotPosition="bottom-right"
          >
            <Avatar className="h-16 w-16 ring-2 ring-border">
              <AvatarImage src={student.profilePhotoUrl || ""} />
              <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-lg">
                {student.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </ProfileWithOnlineStatus>
          
          {/* Full Name - Center */}
          <h3 className="font-semibold text-base leading-tight text-card-foreground">
            {student.fullName}
          </h3>
          
          {/* Username • Class - Center */}
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
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
            <div className="flex gap-1.5 justify-center">
              {student.githubUrl && (
                <Link 
                  href={student.githubUrl} 
                  target="_blank" 
                  className="p-1.5 rounded-md bg-muted hover:bg-muted/80 transition-colors group/social"
                >
                  <IconBrandGithub className="h-3.5 w-3.5 text-muted-foreground group-hover/social:text-card-foreground transition-colors" />
                </Link>
              )}
              {student.linkedinUrl && (
                <Link 
                  href={student.linkedinUrl} 
                  target="_blank" 
                  className="p-1.5 rounded-md bg-muted hover:bg-muted/80 transition-colors group/social"
                >
                  <IconBrandLinkedin className="h-3.5 w-3.5 text-muted-foreground group-hover/social:text-card-foreground transition-colors" />
                </Link>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="px-5 pb-3 space-y-3">
        {/* Bio - Left Align */}
        {student.bio && (
          <div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed text-left">
              {student.bio}
            </p>
          </div>
        )}

        {/* Skills - Left Align */}
        {student.skills.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-medium text-card-foreground text-left">Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {displayedSkills.map((skill) => (
                <Badge
                  key={skill.id}
                  className="text-xs px-1.5 py-0.5 font-medium transition-all duration-200 hover:scale-105"
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
                <Badge variant="outline" className="text-xs px-1.5 py-0.5 text-muted-foreground border-dashed">
                  +{student.skills.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer - Full Width Button */}
      <CardFooter className="px-5 pt-0 pb-4">
        <Button 
          asChild 
          size="sm"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200"
        >
          <Link href={profileUrl}>
            Lihat Profil
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}