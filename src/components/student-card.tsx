import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, MapPin } from "lucide-react";

interface StudentCardProps {
  id: string;
  fullName: string;
  bio?: string;
  profilePhotoUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  className?: string;
  skills: string[];
  projectCount?: number;
}

export function StudentCard({
  id,
  fullName,
  bio,
  profilePhotoUrl,
  githubUrl,
  linkedinUrl,
  className = "",
  skills,
  projectCount = 0
}: StudentCardProps) {
  return (
    <Card className={`group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <CardContent className="p-6">
        {/* Profile Photo */}
        <div className="relative w-20 h-20 mx-auto mb-4">
          {profilePhotoUrl ? (
            <Image
              src={profilePhotoUrl}
              alt={fullName}
              fill
              className="object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{fullName}</h3>
        
        {/* Bio */}
        {bio && (
          <p className="text-gray-600 text-sm text-center mb-4 line-clamp-2 leading-relaxed">
            {bio}
          </p>
        )}

        {/* Project Count */}
        <div className="text-center mb-4">
          <span className="text-sm text-gray-500">
            {projectCount} {projectCount === 1 ? 'Project' : 'Projects'}
          </span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-4 justify-center">
          {skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium"
            >
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">
              +{skills.length - 3}
            </span>
          )}
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          {githubUrl && (
            <Button asChild variant="ghost" size="sm" className="p-2">
              <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4" />
              </Link>
            </Button>
          )}
          {linkedinUrl && (
            <Button asChild variant="ghost" size="sm" className="p-2">
              <Link href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* View Profile Button */}
        <Button asChild className="w-full">
          <Link href={`/students/${id}`}>
            View Profile
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
