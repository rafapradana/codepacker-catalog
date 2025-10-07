import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Github, ExternalLink, Calendar, Eye } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  studentName: string;
  studentId: string;
  profilePhoto?: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  techStacks: string[];
  category?: string;
  views?: number;
  className?: string;
}

export function ProjectCard({
  id,
  title,
  description,
  thumbnail,
  studentName,
  studentId,
  profilePhoto,
  githubUrl,
  liveDemoUrl,
  techStacks,
  category,
  views,
  className = ""
}: ProjectCardProps) {
  return (
    <Card className={`group overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl ${className}`}>
      {/* Thumbnail */}
      <div className="relative h-40 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
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
          <div className="absolute top-2 left-2">
            <span className="px-2 py-0.5 bg-white text-[11px] font-semibold text-gray-900 rounded-full shadow-sm">
              {category}
            </span>
          </div>
        )}
        {views && (
          <div className="absolute top-2 right-2">
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium rounded-full">
              <Eye className="w-2.5 h-2.5" />
              <span>{views}</span>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Title */}
        <h3 className="text-[15px] font-bold text-gray-900 mb-1.5 line-clamp-1">{title}</h3>
        
        {/* Description */}
        <p className="text-gray-600 text-[12px] mb-3 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Tech Stack Label */}
        <div className="mb-3">
          <h4 className="text-[11px] font-semibold text-gray-700 mb-1.5">Tech Stack</h4>
          <div className="flex flex-wrap gap-1.5">
            {techStacks.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[11px] font-medium rounded-md"
              >
                {tech}
              </span>
            ))}
            {techStacks.length > 3 && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[11px] font-medium rounded-md">
                +{techStacks.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Student Info */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
          {profilePhoto ? (
            <div className="relative w-7 h-7 rounded-full overflow-hidden">
              <Image
                src={profilePhoto}
                alt={studentName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
              {studentName.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <Link 
              href={`/students/${studentId}`}
              className="text-[12px] font-semibold text-gray-900 hover:text-blue-600 transition-colors block"
            >
              {studentName}
            </Link>
            <div className="flex items-center text-[11px] text-gray-500">
              📅 15 Januari 2024
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-2">
          {githubUrl && (
            <Button asChild variant="outline" size="sm" className="flex-1 rounded-lg border-gray-300 h-auto py-1.5">
              <Link href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 text-[12px]">
                <Github className="w-3 h-3" />
                <span>Code</span>
              </Link>
            </Button>
          )}
          {liveDemoUrl && (
            <Button asChild variant="outline" size="sm" className="flex-1 rounded-lg border-gray-300 h-auto py-1.5">
              <Link href={liveDemoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 text-[12px]">
                <ExternalLink className="w-3 h-3" />
                <span>Demo</span>
              </Link>
            </Button>
          )}
        </div>

        {/* View Detail Button */}
        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[12px] py-1.5 h-auto">
          <Link href={`/projects/${id}`}>
            Lihat Detail
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
