import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Github, ExternalLink, User } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  studentName: string;
  studentId: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  techStacks: string[];
  category?: string;
  className?: string;
}

export function ProjectCard({
  id,
  title,
  description,
  thumbnail,
  studentName,
  studentId,
  githubUrl,
  liveDemoUrl,
  techStacks,
  category,
  className = ""
}: ProjectCardProps) {
  return (
    <Card className={`group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}>
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-blue-200 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">{title.charAt(0)}</span>
            </div>
          </div>
        )}
        {category && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 rounded-full">
              {category}
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{title}</h3>
        
        {/* Student */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <User className="w-4 h-4 mr-1" />
          <Link 
            href={`/students/${studentId}`}
            className="hover:text-blue-600 transition-colors"
          >
            {studentName}
          </Link>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Tech Stacks */}
        <div className="flex flex-wrap gap-1 mb-4">
          {techStacks.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium"
            >
              {tech}
            </span>
          ))}
          {techStacks.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">
              +{techStacks.length - 3}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${id}`}>
              View Details
            </Link>
          </Button>
          
          <div className="flex items-center space-x-2">
            {githubUrl && (
              <Button asChild variant="ghost" size="sm" className="p-2">
                <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                </Link>
              </Button>
            )}
            {liveDemoUrl && (
              <Button asChild variant="ghost" size="sm" className="p-2">
                <Link href={liveDemoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
